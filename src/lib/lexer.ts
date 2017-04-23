import {
  arrayIncludes,
} from './utils';
import { Options, Tokens } from './typings';

export interface State {
  str: string;
  options?: Options;
  cursor: number;
  tokens: Tokens;
}

export default function lexer(str: string, options: Options): Tokens {
  const state = { str, options, cursor: 0, tokens: [] };
  lex(state);
  return state.tokens;
}



export function lex(state: State): void {
  const { str } = state;
  const len = str.length;
  while (state.cursor < len) {
    const isText = str.charAt(state.cursor) !== '<';
    if (isText) {
      lexText(state);
      continue;
    }

    const isComment = str.startsWith('!--', state.cursor + 1);
    if (isComment) {
      lexComment(state);
      continue;
    }

    const tagName = lexTag(state);
    if (tagName && tagName.charCodeAt(0) <= 122 && tagName.charCodeAt(0) >= 97) {
      if (state.options) {
        const { childlessTags } = state.options;
        if (arrayIncludes(childlessTags, tagName)) {
          lexSkipTag(tagName, state);
        }
      }
    }
  }
}

export function lexText(state: State) {
  const { str, cursor } = state;
  const textEnd = str.indexOf('<', cursor);
  const type = 'text';
  if (textEnd === -1) {
    const payload = str.slice(cursor);
    state.cursor = str.length;
    state.tokens.push({ type, payload });
    return;
  }

  if (textEnd === cursor) {
    return;
  }
  const payload = str.slice(cursor, textEnd);
  payload.trim();
  state.cursor = textEnd;
  state.tokens.push({ type, payload });

}

export function lexExpression(state: State): void {
  const { str, cursor } = state;
  const expressionStart = cursor + 2; // "{{".length
  const expressionEnd = str.indexOf('}}', cursor);
  const type = 'expression';
  const payload = str.slice(expressionStart, expressionEnd);
  state.cursor = expressionEnd + 2; // "}}".length
  state.tokens.push({ type, payload });
}

export function lexComment(state: State): void {
  state.cursor += 4; // "<!--".length
  const { str, cursor } = state;
  const commentEnd = str.indexOf('-->', cursor);
  const type = 'comment';
  if (commentEnd === -1) {
    const payload = str.slice(cursor);
    state.cursor = str.length;
    state.tokens.push({ type, payload });
    return;
  }
  const payload = str.slice(cursor, commentEnd);
  state.cursor = commentEnd + 3; // "-->".length
  state.tokens.push({ type, payload });
}

export function lexTag(state: State) {
  const { str } = state;
  {
    const secondChar = str.charAt(state.cursor + 1); // like </tagName
    const close = secondChar === '/';
    state.tokens.push({ type: 'tag-start', close });
    state.cursor += close ? 2 : 1;
  }
  const tagName = lexTagName(state);
  lexTagAttributes(state);
  {
    const firstChar = str.charAt(state.cursor); // like tagName/>
    const close = firstChar === '/';
    state.tokens.push({ type: 'tag-end', close });
    state.cursor += close ? 2 : 1;
    return tagName;
  }
}

export function lexTagName(state: State) {
  const { str, cursor } = state;
  const len = str.length;
  let start = cursor;
  while (start < len) {
    const char = str.charAt(start);
    const isTagChar = !(char === ' ' || char === '/' || char === '>');
    if (isTagChar) {
      break;
    }
    start++;
  }

  let end = start + 1;
  while (end < len) {
    const char = str.charAt(end);
    const isTagChar = !(char === ' ' || char === '/' || char === '>');
    if (!isTagChar) {
      break;
    }
    end++;
  }

  state.cursor = end;
  const tagName = str.slice(start, end);
  // const firstChar = tagName.charCodeAt(0);
  // if (firstChar >= 65 && firstChar <= 90) {
  //   state.tokens.push({ type: 'component', payload: tagName });
  // } else if (firstChar >= 97 && firstChar <= 122) {
  //   state.tokens.push({ type: 'element', payload: tagName });
  // }
  state.tokens.push({ type: 'tag', payload: tagName});
  return tagName;
}

export function lexTagAttributes(state: State) {
  const { str, tokens } = state;
  let cursor = state.cursor;
  let quote: string | null = null;
  let wordBegin = cursor;
  const words: string[] = [];
  const len = str.length;
  while (cursor < len) {
    const char = str.charAt(cursor);
    if (quote) { // if we have meet a quote before
      const isQuoteEnd = char === quote;
      if (isQuoteEnd) {
        quote = null; // now we have no quote in the stack
      }
      cursor++; // skip it
      continue;
    }

    const isTagEnd = char === '/' || char === '>';
    if (isTagEnd) {
      if (cursor !== wordBegin) { // if really have an attribute
        words.push(str.slice(wordBegin, cursor));
      }
      break;
    }

    const isWordEnd = char === ' ';
    if (isWordEnd) {
      if (cursor !== wordBegin) { // if really have an attribute
        words.push(str.slice(wordBegin, cursor));
      }
      wordBegin = cursor + 1;
      cursor++;
      continue;
    }

    const isQuoteStart = char === '\'' || char === '"';
    if (isQuoteStart) {
      quote = char;
      cursor++;
      continue;
    }

    cursor++; // if all cases are not matched it must be a blank
  }
  state.cursor = cursor;

  const type = 'attribute';
  const wLen = words.length;
  for (let i = 0; i < wLen; i++) {
    const word = words[ i ];
    if (!(word && word.length)) {
      continue;
    }
    const isNotPair = word.indexOf('=') === -1;
    if (isNotPair) {
      const secondWord = words[ i + 1 ];
      if (secondWord && secondWord.startsWith('=')) {
        if (secondWord.length > 1) {
          const newWord = word + secondWord;
          tokens.push({ type, payload: newWord });
          i += 1;
          continue;
        }

        const thirdWord = words[ i + 2 ];
        i += 1;
        if (thirdWord) {
          const newWord = word + '=' + thirdWord;
          tokens.push({ type, payload: newWord });
          i += 1;
          continue;
        }
      }
    }
    if (word.endsWith('=')) {
      const secondWord = words[ i + 1 ];
      if (secondWord && !secondWord.includes('=')) {
        const newWord = word + secondWord;
        tokens.push({ type, payload: newWord });
        i += 1;
        continue;
      }

      const newWord = word.slice(0, -1);
      tokens.push({ type, payload: newWord });
      continue;
    }
    tokens.push({ type, payload: word });
  }
}

export function lexSkipTag(tagName: string, state: State) { // for some tag can not have children
  const { str, cursor, tokens } = state;
  const len = str.length;
  let index = cursor;
  while (index < len) {
    const nextTag = str.indexOf('</', index);
    if (nextTag === -1) {
      lexText(state);
      break;
    }
    const tagState = { str, cursor: nextTag + 2, tokens: [] };
    const name = lexTagName(tagState);
    if (tagName !== name) {
      index = tagState.cursor;
      continue;
    }

    const payload = str.slice(cursor, nextTag);
    tokens.push({ type: 'text', payload });
    const openTag = { type: 'tag-start', close: true };
    const closeTag = { type: 'tag-end', close: false };
    lexTagAttributes(tagState);
    tokens.push(
      { type: 'tag-start', close: true },
      ...tagState.tokens,
      { type: 'tag-end', close: false },
    );
    state.cursor = tagState.cursor + 1;
    break;
  }
}
