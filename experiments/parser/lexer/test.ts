import * as chevrotain from 'chevrotain';

export const DATA = (function oDataFilterGrammarOnlyExample() {
  // ----------------- Lexer -----------------
  const createToken = chevrotain.createToken;
  const Lexer = chevrotain.Lexer;

  const Comma = createToken({ name: 'Comma', pattern: /,/ });
  const Field = createToken({ name: 'Field', pattern: /[\w-]+/ });
  const LParen = createToken({ name: 'LParen', pattern: /\(/ });
  const RParen = createToken({ name: 'RParen', pattern: /\)/ });

  // const InclusionOperator = createToken({ name: 'InclusionOperator', pattern: Lexer.NA });
  // const In = createToken({ name: 'In', pattern: /in/, categories: InclusionOperator });
  // const NotIn = createToken({ name: 'NotIn', pattern: /nin/, categories: InclusionOperator });

  const ComparisonOperator = createToken({ name: 'ComparisonOperator', pattern: Lexer.NA });
  const Eq = createToken({ name: 'Eq', pattern: /eq/, categories: ComparisonOperator });
  const NotEq = createToken({ name: 'NotEq', pattern: /ne/, categories: ComparisonOperator });

  const And = createToken({ name: 'And', pattern: /and/ });
  const Or = createToken({ name: 'Or', pattern: /or/ });

  const Literal = createToken({ name: 'Literal', pattern: Lexer.NA });
  const StringLiteral = createToken({
    name: 'StringLiteral', pattern: /(?:'(?:\\'|[^'])+'|"(?:\\"|[^"])+")/, categories: Literal,
  });
  const ObjectIdLiteral = createToken({
    name: 'ObjectIdLiteral', pattern: /(?:'([a-fA-F\d]{24})'|"([a-fA-F\d]{24})")/, categories: Literal,
  });
  const NumberLiteral = createToken({
    name: 'NumberLiteral', pattern: /-?(0|[1-9]\d*)(\.\d+)?([eE][+-]?\d+)?/, categories: Literal,
  });
  const WhiteSpace = createToken({
    name: 'WhiteSpace',
    pattern: /\s+/,
    group: Lexer.SKIPPED,
  });

  const oDataFilterTokens = [
    WhiteSpace,
    Comma, LParen, RParen,
    NumberLiteral, ObjectIdLiteral, StringLiteral, Literal,
    // In, NotIn, InclusionOperator,
    Eq, NotEq, ComparisonOperator,
    And, Or,
    Field,
  ];

  const ODataFilterLexer = new Lexer(oDataFilterTokens, {
    // Less position info tracked, reduces verbosity of the playground output.
    // positionTracking: "onlyStart"
  });

  // Labels only affect error messages and Diagrams.
  Comma.LABEL = '\',\'';


  // ----------------- parser -----------------
  const CstParser = chevrotain.CstParser;

  class ODataFilterParser extends CstParser {
    constructor() {
      super(oDataFilterTokens, {
        // recoveryEnabled: true,
      });

      const $ = this;

      const DEFAULT_RULE = 'expression';
      $.RULE(DEFAULT_RULE, () => {
        // @ts-ignore
        $.SUBRULE($[OR_EXPRESSION])
      });

      const OR_EXPRESSION = 'orExpression';
      $.RULE(OR_EXPRESSION, () => {
        // @ts-ignore
        $.SUBRULE($[AND_EXPRESSION], { LABEL: 'lhs' });
        $.MANY(() => {
          $.CONSUME(Or);
          // @ts-ignore
          $.SUBRULE2($[AND_EXPRESSION], { LABEL: 'rhs' });
        });
      });

      const AND_EXPRESSION = 'andExpression';
      $.RULE(AND_EXPRESSION, () => {
        $.OR([
          // @ts-ignore
          { ALT: () => $.SUBRULE($[GROUP]) },
          // @ts-ignore
          // { ALT: () => $.SUBRULE($[INCLUSION_EXPRESSION]) },
          // @ts-ignore
          { ALT: () => $.SUBRULE($[COMPARISON_EXPRESSION]) },
          // { ALT: () => $.CONSUME(Comma) },
        ]);
        $.MANY(() => {
          $.CONSUME(And);
          $.OR2([
            // @ts-ignore
            { ALT: () => $.SUBRULE2($[GROUP]) },
            // @ts-ignore
            // { ALT: () => $.SUBRULE2($[INCLUSION_EXPRESSION]) },
            // @ts-ignore
            { ALT: () => $.SUBRULE2($[COMPARISON_EXPRESSION]) },
          ]);
        });
      });

      const COMPARISON_EXPRESSION = 'comparisonExpression';
      $.RULE(COMPARISON_EXPRESSION, () => {
        $.CONSUME(Field);
        $.CONSUME(ComparisonOperator);
        $.CONSUME(Literal);
      });

      const GROUP = 'group';
      $.RULE(GROUP, () => {
        $.CONSUME(LParen);
        // @ts-ignore
        $.SUBRULE($[DEFAULT_RULE]);
        $.CONSUME(RParen);
      });

      // const INCLUSION_EXPRESSION = 'inclusionExpression';
      // $.RULE(INCLUSION_EXPRESSION, () => {
      //   $.CONSUME(Field);
      //   $.CONSUME(InclusionOperator);
      //   $.CONSUME(LParen);
      //   $.MANY_SEP({
      //     SEP: Comma, DEF: () => {
      //       $.CONSUME(Literal);
      //     },
      //   });
      //   $.CONSUME(RParen);
      // });

      // very important to call this after all the rules have been setup.
      // otherwise the parser may not work correctly as it will lack information
      // derived from the self analysis.
      this.performSelfAnalysis();
    }

  }

  // for the playground to work the returned object must contain these fields
  return {
    lexer: ODataFilterLexer,
    parser: ODataFilterParser,
    defaultRule: 'expression',
  };
}());
