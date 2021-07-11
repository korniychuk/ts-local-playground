import { ODataAST, ODataFilterASTBuilder } from './odata-filter-ast-builder';
import { Token, Tokenizer } from './tokenizer';

describe.skip(`${ ODataFilterASTBuilder.name }`, () => {
  it('SCENARIO: Testing inclusion operators', () => {
    // arrange
    // const source = `order_id in ('58f0ce896e034d0001224824', '58f0ce896e034d0001224823')`;
    // const tokens = Tokenizer.parse(source);
    const tokens: Token[] = [
      { type: 'identifier', value: 'order_id', startIndex: 0, endIndex: 7 },
      { type: 'space', value: ' ', startIndex: 8, endIndex: 8 },
      { type: 'identifier', value: 'in', startIndex: 9, endIndex: 10 },
      { type: 'space', value: ' ', startIndex: 11, endIndex: 11 },
      { type: 'lparen', value: '(', startIndex: 12, endIndex: 12 },
      { type: 'string', value: '\'58f0ce896e034d0001224824\'', startIndex: 13, endIndex: 38 },
      { type: 'comma', value: ',', startIndex: 39, endIndex: 39 },
      { type: 'space', value: ' ', startIndex: 40, endIndex: 40 },
      { type: 'string', value: '\'58f0ce896e034d0001224823\'', startIndex: 41, endIndex: 66 },
      { type: 'rparen', value: ')', startIndex: 67, endIndex: 67 },
    ];
    const expected: ODataAST = {
      'type': 'in',
      'left': {
        'token': { 'type': 'identifier', 'value': 'order_id', 'startIndex': 0, 'endIndex': 7 },
        'type': 'field',
        'value': 'order_id',
      },
      'right': [
        {
          'token': { 'type': 'string', 'value': '\'58f0ce896e034d0001224824\'', 'startIndex': 13, 'endIndex': 38 },
          'value': '58f0ce896e034d0001224824',
          'type': 'object-id',
        },
        {
          'token': { 'type': 'string', 'value': '\'58f0ce896e034d0001224823\'', 'startIndex': 41, 'endIndex': 66 },
          'value': '58f0ce896e034d0001224823',
          'type': 'object-id',
        },
      ],
      'lParenToken': { 'type': 'lparen', 'value': '(', 'startIndex': 12, 'endIndex': 12 },
      'rParenToken': { 'type': 'rparen', 'value': ')', 'startIndex': 67, 'endIndex': 67 },
      'token': { 'type': 'identifier', 'value': 'in', 'startIndex': 9, 'endIndex': 10 },
    };

    // act
    const ast = ODataFilterASTBuilder.parse(tokens);

    // assert
    expect(ast).toEqual(expected);
  });

  it('SCENARIO: Comparing operators', () => {
    // arrange
    // const source = `order_id eq '58f0ce896e034d0001224824'`;
    // const tokens = Tokenizer.parse(source);
    const tokens: Token[] = [
      { type: 'identifier', value: 'order_id', startIndex: 0, endIndex: 7 },
      { type: 'space', value: ' ', startIndex: 8, endIndex: 8 },
      { type: 'identifier', value: 'eq', startIndex: 9, endIndex: 10 },
      { type: 'space', value: ' ', startIndex: 11, endIndex: 11 },
      {
        type: 'string', value: '\'58f0ce896e034d0001224824\'', startIndex: 12, endIndex: 37,
      },
    ];
    const expected: ODataAST = {
      left: {
        token: { type: 'identifier', value: 'order_id', startIndex: 0, endIndex: 7 },
        type: 'field',
        value: 'order_id',
      },
      right: {
        token: { type: 'string', value: '\'58f0ce896e034d0001224824\'', startIndex: 12, endIndex: 37 },
        value: '58f0ce896e034d0001224824',
        type: 'object-id',
      },
      token: { type: 'identifier', value: 'eq', startIndex: 9, endIndex: 10 },
      type: 'eq',
    };

    // act
    const ast = ODataFilterASTBuilder.parse(tokens);

    // assert
    expect(ast).toEqual(expected);
  });

  it('SCENARIO: Comparing operators', () => {
    // arrange
    // const source = `order_id eq '58f0ce896e034d0001224824'`;
    // const tokens = Tokenizer.parse(source);
    const tokens: Token[] = [
      { type: 'identifier', value: 'order_id', startIndex: 0, endIndex: 7 },
      { type: 'space', value: ' ', startIndex: 8, endIndex: 8 },
      { type: 'identifier', value: 'eq', startIndex: 9, endIndex: 10 },
      { type: 'space', value: ' ', startIndex: 11, endIndex: 11 },
      {
        type: 'string', value: '\'58f0ce896e034d0001224824\'', startIndex: 12, endIndex: 37,
      },
    ];
    const expected: ODataAST = {
      left: {
        token: { type: 'identifier', value: 'order_id', startIndex: 0, endIndex: 7 },
        type: 'field',
        value: 'order_id',
      },
      right: {
        token: { type: 'string', value: '\'58f0ce896e034d0001224824\'', startIndex: 12, endIndex: 37 },
        value: '58f0ce896e034d0001224824',
        type: 'object-id',
      },
      token: { type: 'identifier', value: 'eq', startIndex: 9, endIndex: 10 },
      type: 'eq',
    };

    // act
    const ast = ODataFilterASTBuilder.parse(tokens);

    // assert
    expect(ast).toEqual(expected);
  });

  it('SCENARIO: Comparing operators', () => {
    // arrange
    // const source = `((order_id eq '58f0ce896e034d0001224824'))`;
    // const tokens = Tokenizer.parse(source);
    const tokens: Token[] = [
      { type: 'lparen', value: '(', startIndex: 0, endIndex: 0 },
      { type: 'lparen', value: '(', startIndex: 1, endIndex: 1 },
      { type: 'identifier', value: 'order_id', startIndex: 2, endIndex: 9 },
      { type: 'space', value: ' ', startIndex: 10, endIndex: 10 },
      { type: 'identifier', value: 'eq', startIndex: 11, endIndex: 12 },
      { type: 'space', value: ' ', startIndex: 13, endIndex: 13 },
      { type: 'string', value: '\'58f0ce896e034d0001224824\'', startIndex: 14, endIndex: 39 },
      { type: 'rparen', value: ')', startIndex: 40, endIndex: 40 },
      { type: 'rparen', value: ')', startIndex: 41, endIndex: 41 },
    ];
    const expected: ODataAST = {
      'item': {
        'item': {
          'left': {
            'token': { 'type': 'identifier', 'value': 'order_id', 'startIndex': 2, 'endIndex': 9 },
            'type': 'field',
            'value': 'order_id',
          },
          'right': {
            'token': {
              'type': 'string',
              'value': '\'58f0ce896e034d0001224824\'',
              'startIndex': 14,
              'endIndex': 39,
            },
            'value': '58f0ce896e034d0001224824',
            'type': 'object-id',
          },
          'token': { 'type': 'identifier', 'value': 'eq', 'startIndex': 11, 'endIndex': 12 },
          'type': 'eq',
        },
        'rParenToken': { 'type': 'rparen', 'value': ')', 'startIndex': 40, 'endIndex': 40 },
        'token': { 'type': 'lparen', 'value': '(', 'startIndex': 1, 'endIndex': 1 },
        'type': 'group',
      },
      'rParenToken': { 'type': 'rparen', 'value': ')', 'startIndex': 41, 'endIndex': 41 },
      'token': { 'type': 'lparen', 'value': '(', 'startIndex': 0, 'endIndex': 0 },
      'type': 'group',
    };

    // act
    const ast = ODataFilterASTBuilder.parse(tokens);

    // assert
    expect(ast).toEqual(expected);
  });

  describe('SCENARIO: Logical operators', () => {
    it('AND operator, without parenthesis', () => {
      // arrange
      // const source = `type eq 'order' and status eq 'ready' and num ne 11`;
      // const tokenizer = Tokenizer.parse(source);
      // console.log(tokenizer.getTokens());

      const tokens: Token[] = [
        { type: 'identifier', value: 'type', startIndex: 0, endIndex: 3 },
        { type: 'space', value: ' ', startIndex: 4, endIndex: 4 },
        { type: 'identifier', value: 'eq', startIndex: 5, endIndex: 6 },
        { type: 'space', value: ' ', startIndex: 7, endIndex: 7 },
        { type: 'string', value: '\'order\'', startIndex: 8, endIndex: 14 },
        { type: 'space', value: ' ', startIndex: 15, endIndex: 15 },
        { type: 'identifier', value: 'and', startIndex: 16, endIndex: 18 },
        { type: 'space', value: ' ', startIndex: 19, endIndex: 19 },
        { type: 'identifier', value: 'status', startIndex: 20, endIndex: 25 },
        { type: 'space', value: ' ', startIndex: 26, endIndex: 26 },
        { type: 'identifier', value: 'eq', startIndex: 27, endIndex: 28 },
        { type: 'space', value: ' ', startIndex: 29, endIndex: 29 },
        { type: 'string', value: '\'ready\'', startIndex: 30, endIndex: 36 },
        { type: 'space', value: ' ', startIndex: 37, endIndex: 37 },
        { type: 'identifier', value: 'and', startIndex: 38, endIndex: 40 },
        { type: 'space', value: ' ', startIndex: 41, endIndex: 41 },
        { type: 'identifier', value: 'num', startIndex: 42, endIndex: 44 },
        { type: 'space', value: ' ', startIndex: 45, endIndex: 45 },
        { type: 'identifier', value: 'ne', startIndex: 46, endIndex: 47 },
        { type: 'space', value: ' ', startIndex: 48, endIndex: 48 },
        { type: 'number', value: '11', startIndex: 49, endIndex: 50 },
      ];
      const expected: ODataAST = {
        'left': {
          'left': {
            'left': {
              'token': { 'type': 'identifier', 'value': 'type', 'startIndex': 0, 'endIndex': 3 },
              'type': 'field',
              'value': 'type',
            },
            'right': {
              'token': { 'type': 'string', 'value': '\'order\'', 'startIndex': 8, 'endIndex': 14 },
              'value': 'order',
              'type': 'string',
            },
            'token': { 'type': 'identifier', 'value': 'eq', 'startIndex': 5, 'endIndex': 6 },
            'type': 'eq',
          },
          'right': {
            'left': {
              'token': { 'type': 'identifier', 'value': 'status', 'startIndex': 20, 'endIndex': 25 },
              'type': 'field',
              'value': 'status',
            },
            'right': {
              'token': { 'type': 'string', 'value': '\'ready\'', 'startIndex': 30, 'endIndex': 36 },
              'value': 'ready',
              'type': 'string',
            },
            'token': { 'type': 'identifier', 'value': 'eq', 'startIndex': 27, 'endIndex': 28 },
            'type': 'eq',
          },
          'type': 'and',
          'token': { 'type': 'identifier', 'value': 'and', 'startIndex': 16, 'endIndex': 18 },
        },
        'right': {
          'left': {
            'token': { 'type': 'identifier', 'value': 'num', 'startIndex': 42, 'endIndex': 44 },
            'type': 'field',
            'value': 'num',
          },
          'right': {
            'token': { 'type': 'number', 'value': '11', 'startIndex': 49, 'endIndex': 50 },
            'value': 11,
            'type': 'number',
          },
          'token': { 'type': 'identifier', 'value': 'ne', 'startIndex': 46, 'endIndex': 47 },
          'type': 'ne',
        },
        'type': 'and',
        'token': { 'type': 'identifier', 'value': 'and', 'startIndex': 38, 'endIndex': 40 },
      };

      // act
      const ast = ODataFilterASTBuilder.parse(tokens);

      // assert
      expect(ast).toEqual(expected);
    });
  });
});
