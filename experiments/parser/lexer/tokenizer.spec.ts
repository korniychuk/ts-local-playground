import { Tokenizer, Token } from './tokenizer';

describe(`${ Tokenizer.name }`, () => {
  it('testttt', () => {
    // arrange
    const expected: Token[] = [
      { type: 'identifier', startIndex: 0,   endIndex: 2,   value: 'aaa' },
      { type: 'space',      startIndex: 3,   endIndex: 3,   value: ' ' },
      { type: 'identifier', startIndex: 4,   endIndex: 5,   value: 'in' },
      { type: 'space',      startIndex: 6,   endIndex: 6,   value: ' ' },
      { type: 'lparen',     startIndex: 7,   endIndex: 7,   value: '(' },
      { type: 'number',     startIndex: 8,   endIndex: 10,  value: '111' },
      { type: 'comma',      startIndex: 11,  endIndex: 11,  value: ',' },
      { type: 'space',      startIndex: 12,  endIndex: 12,  value: ' ' },
      { type: 'number',     startIndex: 13,  endIndex: 15,  value: '222' },
      { type: 'rparen',     startIndex: 16,  endIndex: 16,  value: ')' },
      { type: 'space',      startIndex: 17,  endIndex: 17,  value: ' ' },
      { type: 'identifier', startIndex: 18,  endIndex: 20,  value: 'and' },
      { type: 'space',      startIndex: 21,  endIndex: 21,  value: ' ' },
      { type: 'lparen',     startIndex: 22,  endIndex: 22,  value: '(' },
      { type: 'identifier', startIndex: 23,  endIndex: 28,  value: 'origin' },
      { type: 'space',      startIndex: 29,  endIndex: 29,  value: ' ' },
      { type: 'identifier', startIndex: 30,  endIndex: 31,  value: 'ne' },
      { type: 'space',      startIndex: 32,  endIndex: 32,  value: ' ' },
      { type: 'string',     startIndex: 33,  endIndex: 40,  value: "'mobile'" },
      { type: 'rparen',     startIndex: 41,  endIndex: 41,  value: ')' },
      { type: 'space',      startIndex: 42,  endIndex: 42,  value: ' ' },
      { type: 'identifier', startIndex: 43,  endIndex: 45,  value: 'and' },
      { type: 'space',      startIndex: 46,  endIndex: 46,  value: ' ' },
      { type: 'lparen',     startIndex: 47,  endIndex: 47,  value: '(' },
      { type: 'identifier', startIndex: 48,  endIndex: 58,  value: 'destination' },
      { type: 'space',      startIndex: 59,  endIndex: 59,  value: ' ' },
      { type: 'identifier', startIndex: 60,  endIndex: 61,  value: 'eq' },
      { type: 'space',      startIndex: 62,  endIndex: 62,  value: ' ' },
      { type: 'string',     startIndex: 63,  endIndex: 88,  value: "'58f0ce896e034d0001224824'" },
      { type: 'rparen',     startIndex: 89,  endIndex: 89,  value: ')' },
      { type: 'space',      startIndex: 90,  endIndex: 90,  value: ' ' },
      { type: 'identifier', startIndex: 91,  endIndex: 93,  value: 'and' },
      { type: 'space',      startIndex: 94,  endIndex: 94,  value: ' ' },
      { type: 'lparen',     startIndex: 95,  endIndex: 95,  value: '(' },
      { type: 'lparen',     startIndex: 96,  endIndex: 96,  value: '(' },
      { type: 'identifier', startIndex: 97,  endIndex: 108, value: 'order_status' },
      { type: 'space',      startIndex: 109, endIndex: 109, value: ' ' },
      { type: 'identifier', startIndex: 110, endIndex: 111, value: 'eq' },
      { type: 'space',      startIndex: 112, endIndex: 112, value: ' ' },
      { type: 'string',     startIndex: 113, endIndex: 119, value: "'saved'" },
      { type: 'rparen',     startIndex: 120, endIndex: 120, value: ')' },
      { type: 'space',      startIndex: 121, endIndex: 121, value: ' ' },
      { type: 'identifier', startIndex: 122, endIndex: 123, value: 'or' },
      { type: 'space',      startIndex: 124, endIndex: 124, value: ' ' },
      { type: 'lparen',     startIndex: 125, endIndex: 125, value: '(' },
      { type: 'identifier', startIndex: 126, endIndex: 137, value: 'order_status' },
      { type: 'space',      startIndex: 138, endIndex: 138, value: ' ' },
      { type: 'identifier', startIndex: 139, endIndex: 140, value: 'eq' },
      { type: 'space',      startIndex: 141, endIndex: 141, value: ' ' },
      { type: 'string',     startIndex: 142, endIndex: 152, value: "'suspended'" },
      { type: 'rparen',     startIndex: 153, endIndex: 153, value: ')' },
      { type: 'rparen',     startIndex: 154, endIndex: 154, value: ')' }
    ];

    const lexer = Tokenizer.parse(`aaa in (111, 222) and (origin ne 'mobile') and (destination eq '58f0ce896e034d0001224824') and ((order_status eq 'saved') or (order_status eq 'suspended'))`);
    const res = lexer.getTokens();

    // act

    expect(res).toEqual(expected);
    // assert
  });
});
