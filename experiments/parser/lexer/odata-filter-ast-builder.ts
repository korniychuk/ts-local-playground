import * as _ from 'lodash';
import * as __ from 'lodash/fp';

import { Token } from './tokenizer';

type LogicalBinaryOperatorTypes = 'or' | 'and';
type ComparingComparingOperatorTypes = 'eq' | 'ne' | 'in' | 'nin';
type BinaryOperatorTypes = LogicalBinaryOperatorTypes | ComparingComparingOperatorTypes;
const binaryOperatorsTypes: BinaryOperatorTypes[] = ['or', 'and', 'eq', 'ne', 'in', 'nin']

interface BaseASTNode<T extends string = string> {
  type: T;
  token: Token;
}

type LiteralASTNodeType = 'string' | 'object-id' | 'number';
interface LiteralASTNode<T = any> extends BaseASTNode<LiteralASTNodeType> {
  value: T;
}

interface FieldASTNode<T = any> extends BaseASTNode<'field'> {
  value: string;
}

export interface ComparingBinaryOperatorASTNode extends BaseASTNode<'eq' | 'ne'> {
  left: FieldASTNode;
  right: LiteralASTNode;
}

export interface InclusionBinaryOperatorASTNode extends BaseASTNode<'in' | 'nin'> {
  left: FieldASTNode;
  right: LiteralASTNode[];
  lParenToken: Token;
  rParenToken: Token;
}

export interface GroupASTNode extends BaseASTNode<'group'> {
  item: ODataAST;
  rParenToken: Token;
}

interface DevGroupASTNode extends BaseASTNode<'group'> {
  items: (Token | BaseASTNode)[];
  rParenToken: Token;
}

export interface LogicalBinaryOperatorASTNode extends BaseASTNode<'and' | 'or'> {
  left: UOperatorASTNode;
  right: UOperatorASTNode;
}

type UOperatorASTNode =
  | ComparingBinaryOperatorASTNode
  | DevGroupASTNode
  | InclusionBinaryOperatorASTNode
  | LogicalBinaryOperatorASTNode
  ;

export type ODataAST = Exclude<UOperatorASTNode, DevGroupASTNode> | GroupASTNode;

export class ODataFilterASTBuilder {
  /**
   * The AST building algorithm is so simplified.
   * Current implementation can't handle fields that called the same as OData keywords.
   */
  private readonly disallowedFieldNames: Set<string> = new Set(binaryOperatorsTypes);
  private readonly operatorNames: Set<string> = new Set([...binaryOperatorsTypes, 'group']);

  public static parse(tokens: Token[]): BaseASTNode | undefined {
    const ast = new this(tokens);
    ast.parse();
    return ast.getAst();
  }

  private ast: (Token | BaseASTNode)[] = [];

  private constructor(
    private readonly sourceTokens: Token[],
  ) {}

  private parse(): void {
    const [ast, groups] = _.flow(
      __.filter<Token>(v => v.type !== 'space'),
      this.convertSimpleNodes.bind(this),
      this.convertInclusionOperators.bind(this),
      this.convertComparingOperators.bind(this),
      this.convertParenthesis.bind(this),
    )(this.sourceTokens);

    const iterateAst: (ast: (Token | BaseASTNode)[]) => typeof ast = _.flow(
      this.convertLogicalOperator.bind(this, 'and'),
      this.convertLogicalOperator.bind(this, 'or'),
    );

    /*
     * TODO[DONE]: Закончил на том, что нужно:
     * 1. группы почему-то не итерируются
     */
    groups.forEach((devGroup) => {
      // devGroup.items = iterateAst(devGroup.items);
      // const group = devGroup as any as GroupASTNode;
      // group.item = devGroup.items[0] as ODataAST;
      // delete devGroup.items;
    });
    this.ast = iterateAst(ast);

    // AST should have the only one root
    if (this.ast.length > 1) {
      const wrongToken = this.ast.find(v => this.isToken(v));
      if (wrongToken) throw new Error(`Unexpected token: ${ JSON.stringify(wrongToken) }`);

      const ast = this.ast as BaseASTNode[]; // Possible Token types were rejected some lines above
      if (this.isOperator(ast[0]) && this.isOperator(ast[1])) {
        throw new Error(`Two operators in a row is not allowed:
          First: ${ JSON.stringify(this.ast[0]) }
          Second: ${ JSON.stringify(this.ast[1]) }
        `);
      }

      throw new Error(`Unexpected ASTNode: ${ JSON.stringify(this.ast[1]) }`);
    }
  }

  private getAst(): BaseASTNode | undefined {
    return this.isNode(this.ast[0]) ? this.ast[0] : undefined;
  }

  private convertSimpleNodes(tokens: Token[]): (Token | BaseASTNode)[] {
    return tokens.map(token => {
      switch (token.type) {
        case 'number': {
          const value = +token.value;
          if (Number.isNaN(value)) {
            throw new Error(`A token with the type 'number' turns into NaN after converting to a number. Raw: ${ token.value }`);
          }
          const node: LiteralASTNode = { token, value, type: 'number' };
          return node;
        }
        case 'string': {
          const value = token.value.replace(/^(['"])(.*)\1$/g, '$2'); // trimming quotes
          const node: LiteralASTNode = { token, value, type: this.isObjectId(value) ? 'object-id' : 'string' };
          return node;
        }
        case 'identifier': {
          if (this.disallowedFieldNames.has(token.value)) return token;
          const node: FieldASTNode = { token, type: 'field', value: token.value };
          return node;
        }
        default:
          return token;
      }
    });
  }

  private convertInclusionOperators(mixed: (Token | BaseASTNode)[]): typeof mixed {
    const isInclusionOperator = (v: string): v is InclusionBinaryOperatorASTNode['type'] => ['in', 'nin'].includes(v);
    const list: typeof mixed = [];

    let operatorToken: Token | undefined;
    let lParenToken: Token | undefined;
    let fieldNode: FieldASTNode | undefined;
    let operator: InclusionBinaryOperatorASTNode['type'] | undefined;
    let items: LiteralASTNode[] | undefined;
    let shouldBeALiteral: boolean = false;

    for (let i = 0; i < mixed.length; i++) {
      const curr = mixed[i];

      // Looking for a supported binary operator of inclusion
      if (!operator) { // execution didn't step into an operator yet
        const next = mixed[i + 1];
        if (!next || !this.isToken(next) || next.type !== 'identifier' || !isInclusionOperator(next.value)) {
          list.push(curr);
          continue;
        }

        // 1. Inclusion operator is founded
        if (this.isToken(curr)) throw new Error(`An ASTNode expected. A token is given: ${ JSON.stringify(curr) }`);
        if (!this.isField(curr)) throw new Error(`A FieldASTNode expected. Given node: ${ JSON.stringify(curr) }`);

        fieldNode = curr;
        operator = next.value;
        operatorToken = next;
        i++; // skipping the next iteration because it contains already parsed operator token
        continue;
      }

      // execution already inside an operator
      if (!items) { // lparen is not read yet, reading ...
        if (!this.isToken(curr) || curr.type !== 'lparen') {
          throw new Error(`Left parenthesis token is expected at the right hand of ${operator}.
            Given: ${ JSON.stringify(curr) }`);
        }
        items = [];
        shouldBeALiteral = true;
        lParenToken = curr;
        continue;
      }

      // lparen is already read, looking for a literal
      if (shouldBeALiteral) { // execution comes into after 'lparen' or 'comma'
        if (this.isToken(curr)) throw new Error(`A LiteralASTNode is expected. Given a token: ${ JSON.stringify(curr) }`);
        if (!this.isLiteral(curr)) {
          throw new Error(`A LiteralASTNode is expected. Given ASTNode: ${JSON.stringify(curr)}`);
        }
        items.push(curr);
        shouldBeALiteral = false;
        continue;
      }

      // Looking for a Comma or RParen token after a literal
      if (this.isToken(curr)) {
        if (curr.type === 'comma') {
          shouldBeALiteral = true;
          continue;
        }
        if (curr.type === 'rparen') { // the end of the inclusion operator
          const node: InclusionBinaryOperatorASTNode = {
            lParenToken: lParenToken!,
            rParenToken: curr,
            type: operator,
            token: operatorToken!,
            left: fieldNode!,
            right: items,
          };
          list.push(node);
          operator = undefined;
          items = undefined;
          continue;
        }
      }
      throw new Error(`Comma or RParen Token is expected. Given: ${ JSON.stringify(curr) }`);
    } // END for(...)

    return list;
  } // END convertInclusionOperators()

  private convertComparingOperators(mixed: (Token | BaseASTNode)[]): typeof mixed {
    const isInclusionOperator = (v: string): v is ComparingBinaryOperatorASTNode['type'] => ['eq', 'ne'].includes(v);
    const list: typeof mixed = [];

    for (let i = 0; i < mixed.length; i++) {
      const curr = mixed[i];
      const next = mixed[i + 1];
      if (!next || !this.isToken(next) || next.type !== 'identifier' || !isInclusionOperator(next.value)) {
        list.push(curr);
        continue;
      }

      if (this.isToken(curr)) throw new Error(`An ASTNode expected. A token is given: ${ JSON.stringify(curr) }`);
      if (!this.isField(curr)) throw new Error(`A FieldASTNode expected. Given node: ${ JSON.stringify(curr) }`);

      const operator = next.value;
      const operatorToken = next;
      const fieldNode = curr;

      const afterNext = mixed[i + 2];
      if (!afterNext) {
        throw new Error(`Expected literal on the right hand of ${ operator } is absent.
          Operator Token: ${ JSON.stringify(operatorToken) }`);
      }
      if (!this.isNode(afterNext) || !this.isLiteral(afterNext)) {
        throw new Error(`A LiteralASTNode as the right operand of '${ operator }' operator is expected.
          Given: ${ JSON.stringify(afterNext) }`);
      }

      const node: ComparingBinaryOperatorASTNode = {
        left: fieldNode,
        right: afterNext,
        token: operatorToken,
        type: operator,
      };
      list.push(node);

      i += 2; // skipping the operator node & right-operand node
    } // END for(...)

    return list;
  }

  public convertParenthesis(mixed: (Token | BaseASTNode)[]): [typeof mixed, DevGroupASTNode[]] {
    const list: typeof mixed = [];
    const allGroups: DevGroupASTNode[] = [];

    const stack: { lParenToken: Token; items: typeof mixed }[] = [];
    for (let i = 0; i < mixed.length; i++) {
      const curr = mixed[i];
      if (!this.isToken(curr) || curr.type !== 'lparen' && curr.type !== 'rparen') {
        (stack[stack.length - 1]?.items || list).push(curr);
        continue;
      }

      // Handling left parenthesis
      if (curr.type === 'lparen') {
        stack.push({ lParenToken: curr, items: [] });
        continue;
      }

      // Handling left parenthesis
      const last = stack.pop();
      if (!last) {
        throw new Error(`Unexpected RParen Token. No matching left parenthesis found: ${ JSON.stringify(curr) }`);
      }
      if (!last.items.length) {
        throw new Error(`Empty groups is not allowed. Group token: ${ JSON.stringify(last.lParenToken) }`);
      }
      const node: DevGroupASTNode = {
        // A typing error here. I decided not to fix it because it would produce a lot of new interfaces.
        // Resulting AST should contain only AST nodes, but during parsing, the group might contain Tokens.
        // The validation with searching of Tokens is implemented in .parse() method.
        items: last.items as any,
        rParenToken: curr,
        token: last.lParenToken!,
        type: 'group',
      };
      (stack[stack.length - 1]?.items || list).push(node);
    } // END for(...)

    const last = stack[stack.length - 1];
    if (last) {
      throw new Error(`Can't find closing parenthesis for token: ${ JSON.stringify(last.lParenToken) }`);
    }

    return [list, allGroups];
  }

  private convertLogicalOperator(operator: LogicalBinaryOperatorTypes, mixed: (Token | BaseASTNode)[]): typeof mixed {
    const list: typeof mixed = [];

    for (let i = 0; i < mixed.length; i++) {
      const curr = mixed[i];
      if (!this.isToken(curr) || curr.type !== 'identifier' || curr.value !== operator) {
        list.push(curr);
        continue;
      }

      const prev = list.pop();
      if (!prev) {
        throw new Error(`Expected left operand of the '${ operator }' operator is absent. Token: ${ JSON.stringify(curr) }`);
      }
      if (this.isToken(prev)) {
        throw new Error(`An ASTNode is expected on the left hand of the '${ operator }' operator.
          Given token: ${ JSON.stringify(prev) }`);
      }
      if (!this.isOperator(prev)) {
        throw new Error(`An OperatorASTNode is expected on the left hand of the '${ operator }' operator.
          Given: ${ JSON.stringify(prev) }`);
      }

      const next = mixed[i + 1];
      if (!next) {
        throw new Error(`Expected right operand of the '${ operator }' operator is absent. Token: ${ JSON.stringify(curr) }`);
      }
      if (this.isToken(next)) {
        throw new Error(`An ASTNode is expected on the right hand of the '${ operator }' operator.
          Given token: ${ JSON.stringify(next) }`);
      }
      if (!this.isOperator(next)) {
        throw new Error(`An OperatorASTNode is expected on the right hand of the '${ operator }' operator.
          Given: ${ JSON.stringify(next) }`);
      }

      const node: LogicalBinaryOperatorASTNode = {
        left: prev,
        right: next,
        type: operator,
        token: curr,
      };
      list.push(node);

      i++; // skipping the operator node & right-operand node
    }

    return list;
  }

  private isToken(value: Token | BaseASTNode): value is Token {
    return (value as Token).endIndex !== undefined && (value as Token).startIndex !== undefined;
  }

  private isNode(value: Token | BaseASTNode): value is BaseASTNode {
    return !this.isToken(value);
  }

  private isLiteral(node: BaseASTNode): node is LiteralASTNode {
    const literalTypes: LiteralASTNodeType[] = ['string', 'number', 'object-id'];
    return (literalTypes as string[]).includes(node.type);
  }

  private isField(node: BaseASTNode): node is FieldASTNode {
    return node.type === 'field';
  }

  private isGroup<T extends DevGroupASTNode | GroupASTNode = DevGroupASTNode>(node: BaseASTNode | any): node is T {
    return node?.type === 'group';
  }

  private isOperator(node: BaseASTNode): node is UOperatorASTNode {
    return this.operatorNames.has(node.type);
  }

  private isObjectId(value: string): boolean {
    return /^[a-f\d]{24}$/i.test(value);
  }

}

