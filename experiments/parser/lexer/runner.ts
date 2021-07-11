import { DATA } from './test';
import * as _ from 'lodash';
import { CstParser } from '@chevrotain/types';

// ONLY ONCE
const parser = new DATA.parser()

function parseInput(text: string) {
  const lexingResult = DATA.lexer.tokenize(text)

  // console.log('LEX:', lexingResult);
  // "input" is a setter which will reset the parser's state.
  if (lexingResult.errors.length) {
    console.log('Lexer Errors:', lexingResult.errors);
  }
  parser.input = lexingResult.tokens
  // @ts-ignore
  parser.expression();

  if (parser.errors.length > 0) {
    console.log(JSON.stringify(_.omit(parser.errors[0], ['resyncedTokens']), null, 2));

    throw new Error("sad sad panda, Parsing errors detected");
  }
}

// const inputText = `a-field in ( 111 , '2"22\\'22' ) and key eq 'value'`;
// const inputText = `a-field in ( 111 , '2"22\\'22' ) and key eq 'value' and name ne 'test' or val in (11,22)`;
const inputText = `a-field eq 15 and key eq 'value' and name ne 'test' or val ne 'aoeuaoeuo'`;
const res = parseInput(inputText);

console.log('RES: ', res);

