import * as _ from 'lodash';

export type TokenType = 'comma' | 'identifier' | 'lparen' | 'number' | 'rparen' | 'space' | 'string';

export interface Token {
  type: TokenType;
  value: string;
  startIndex: number;
  endIndex: number;
}

export class Tokenizer {
  public static parse(codeFragment: string): Tokenizer {
    const lexer = new this(codeFragment);
    lexer.parse();
    return lexer;
  }

  private readonly regExps: Record<TokenType, RegExp> = {
    comma:      /^,/s,
    lparen:     /^\(/s,
    rparen:     /^\)/s,
    number:     /^\d+(\.\d+)?/s,
    identifier: /^[\w.-]+/s,
    space:      /^\s+/s,
    string:     /^(['"])((?:\\\1|(?!\1).)*)\1/s,
  };

  private tokens: Token[] = [];

  private constructor(
    private readonly source: string,
  ) {}

  public getTokens(): Token[] {
    return [...this.tokens];
  }

  private parse(): void {
    const tokens: Token[] = []
    let sourcePart = this.source;
    let nextStartIndex = 0;
    const ITERATIONS_LIMIT = 50000; // iterations limit to protect an infinite loop
    let i: number;
    for (i = 0; i < ITERATIONS_LIMIT; i++) {
      const partialToken = this.findToken(sourcePart);
      if (!partialToken) break;
      tokens.push({
        ...partialToken,
        startIndex: nextStartIndex,
        endIndex: nextStartIndex + partialToken.value.length - 1,
      });
      nextStartIndex += partialToken.value.length
      sourcePart = sourcePart.slice(partialToken.value.length);
    }

    if (i >= ITERATIONS_LIMIT) {
      throw new Error(`Lexer.parse() Iterations limit has been reached. Usually it means the loop is infinite.`);
    }
    if (sourcePart.length) {
      throw new Error(`Lexer.parse() Unexpected token at ${ nextStartIndex }. Invalid fragment: ${ sourcePart.slice(0, 10) } ...`);
    }

    this.tokens = tokens;
  }

  private findToken(sourcePart: string): Pick<Token, 'type' | 'value'> | undefined {
    let res: Pick<Token, 'type' | 'value'> | undefined;

    _.some<any>(this.regExps, (regExp: RegExp, type: TokenType) => {
      // console.log('TYPE: ', type);
      const match = sourcePart.match(regExp);
      if (match?.[0]) {
        res = { type, value: match[0] }
        return true;
      }
    });

    return res;
  }

}
