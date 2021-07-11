import * as _ from 'lodash';

import { Token, TokenType } from './tokenizer';

type LogicalBinaryOperatorTypes = 'or' | 'and';
type ComparingComparingOperatorTypes = 'eq' | 'ne' | 'in' | 'nin';
type BinaryOperatorTypes = LogicalBinaryOperatorTypes | ComparingComparingOperatorTypes;

type OtherOperatorTypes = 'group' | 'list';
export type OperatorName = BinaryOperatorTypes | OtherOperatorTypes;

type ExpressionGroup = 'literal' | 'field' | 'operator';
type LiteralName = 'string' | 'number' | 'object-id';

type PartialAST = (Token | Expression)[];

export abstract class Expression {
  public abstract group: ExpressionGroup;

  public static is<T extends Expression = Expression>(value: T | unknown): value is T {
    return value instanceof this;
  }

  protected static isToken(node: Token | Expression, type?: TokenType): node is Token {
    return !Expression.is(node) && (type === undefined || (node as Token).type === type);
  }

}

export class Field extends Expression {
  public group: ExpressionGroup = 'field';

  /**
   * The AST building algorithm is so simplified.
   * Current implementation can't handle fields that called the same as OData keywords.
   */
  private static readonly disallowedFieldNames: Set<string> = new Set<BinaryOperatorTypes>(['or', 'and', 'eq', 'ne', 'in', 'nin']);

  public constructor(
    public readonly value: string,
    public readonly token: Token,
  ) {
    super();
  }

  public static try(token: Token): Field | undefined {
    if (token.type !== 'identifier' || !this.disallowedFieldNames.has(token.value)) return;
    const literal = new this(token.value, token);

    return literal;
  }

}

export abstract class Literal<T> extends Expression {
  public group: ExpressionGroup = 'literal';

  public constructor(
    public readonly value: T,
    public readonly token: Token,
  ) {
    super();
  }

  public static try(token: Token): Literal<any> | undefined {
    throw new Error(`Literal.parse() This is an abstract method. Override it to use.`);
  }

}

export class StringLiteral extends Literal<string> {
  public name: LiteralName = 'string';

  public static try(token: Token): StringLiteral | undefined {
    if (token.type !== 'string') return;
    const value = token.value.slice(1, token.value.length - 2);
    const literal = new this(value, token);

    return literal;
  }

}

export class ObjectIdLiteral extends StringLiteral {
  public name: LiteralName = 'object-id';

  private static readonly objectIdRegExp: RegExp = /^[a-f\d]{24}$/i ;

  public static try(token: Token): ObjectIdLiteral | undefined {
    const literal = super.try(token);
    if (!literal || !this.objectIdRegExp.test(literal.value)) return;
    return literal;
  }
}
export class NumberLiteral extends Literal<number> {
  public name: LiteralName = 'number';

  public static try(token: Token): Literal<any> | undefined {
    if (token.type !== 'number') return;
    const value = +token.value;
    if (Number.isNaN(value)) return;
    const literal = new this(value, token);

    return literal;
  }
}

export abstract class Operator extends Expression {
  public group: ExpressionGroup = 'operator';
  public static readonly type!: OperatorName;
  public readonly type!: OperatorName = (this.constructor as typeof Operator).type;

  public static findFirstIndex(partialAst: PartialAST): number {
    throw new Error(`Operator.findFirstIndex() The method should be overridden in a child class!`);
  }

  public static walk(partialAst: PartialAST): PartialAST | undefined {
    throw new Error(`Operator.walk() Unavailable!`);
  }
}

export abstract class BinaryOperator<TLeft = any, TRight = any> extends Operator {
  public left!: TLeft;
  public right!: TRight;
  public operatorToken!: Token;
}

export class LogicalBinaryOperator extends BinaryOperator<Expression, Expression> {
}

export class ComparingBinaryOperator extends BinaryOperator<StringLiteral, Literal<any> | List> {
}

export class Group extends Operator<'group'> {
  public leftToken!: Token;
  public value!: Expression;
  public rightToken!: Token;
}

export class InBinaryOperator extends BinaryOperator<StringLiteral, Literal<any>[]> {
  public readonly type: OperatorName = 'in';

  public static findFirstIndex(partialAst: PartialAST): number {
    return partialAst.findIndex(node => this.isToken(node, 'identifier') && node.value.toLowerCase() !== this.name);
  }

  public static walk(partialAst: PartialAST): PartialAST | undefined {

    // TODO: try forEach
    for (let i = 0; i < partialAst.length; i++) {
      const curr: Token | Expression = partialAst[i];
      if (!this.isToken(curr, 'identifier') || curr.value.toLowerCase() !== this.name) continue;
      // const next = partialAst[i + 1];
      // if (!this.isToken(next, 'lparen')) continue;
      const prev = partialAst[i - 1];
      if (this.isToken(prev)) {
        if (prev.type !== 'identifier') {

        }
      }

      if (!prev || !this.isToken(prev))
      if (curr.type === 'lparen' && partialAst[i - 1]?.type)
    }
  }

  public leftToken!: Token;
  public items!: Literal<any>[];
  public rightToken!: Token;
}

export class NotInBinaryOperator extends InBinaryOperator {
  public readonly type: OperatorName = 'nin';
}


// type Contexts = 'common' | 'after-literal'

/**
 * Abstract Syntax Tree
 */
export class ODataFilterAST {

  private readonly static simpleExpressions = [Field, ObjectIdLiteral, StringLiteral, NumberLiteral];
  private readonly static operatorPriorities: (typeof Operator | typeof Operator[])[] = [
    [InBinaryOperator, NotInBinaryOperator],
    // ['eq', 'ne'],
    // 'group',
    // 'or',
    // 'and',
  ];

  public static parse(tokens: Token[]): ODataFilterAST {
    const ast = new ODataFilterAST(tokens);
    ast.parse();
    return ast;
  }

  // private ast: Token[] = [];

  private constructor(
    private readonly sourceTokens: Token[],
  ) {}

  private parse(): void {
    const data = this.sourceTokens
                     .filter(token => token.type !== 'space')
                     .map(token => this.tryToConvertATokenToASimpleASTNode(token));

  }

  private tryToConvertATokenToASimpleASTNode(token: Token): Token | Literal<any> | Field {
    for (let expression of ODataFilterAST.simpleExpressions) {
      const node = expression.try(token);
      if (node) return node;
    }
    return token;
  }

}
