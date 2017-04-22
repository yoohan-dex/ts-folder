import { arrayIncludes, stringIncludes } from './utils';
import { Node, Tokens, Options, Token, ArrowToken } from './typings';

export interface State {
  tokens: Tokens;
  options: Options;
  cursor: number;
  stack: Stack[];
}

interface Root {
  tagName: null;
  children: Node[];
}

interface Stack {
  tagName: string;
  children: Node[];
}

export default function parser(tokens, options) {
  const root: Root = { tagName: null, children: [] };
  const state: State = { tokens, options, cursor: 0, stack: [ root ] };
  parse(state);
  return root.children;
}

export function parse(state: State) {
  const { tokens, options } = state;
  let { stack } = state;
  let nodes = stack[ stack.length - 1 ].children;
  const len = tokens.length;
  let { cursor } = state;
  while (cursor < len) {
    const token = tokens[ cursor ];
    if (token.type !== 'tag-start' && token.type !== 'tag-end') {
      const node = { type: token.type, content: token.payload } as Node;
      nodes.push(node);
      cursor++;
      continue;
    }

    const tagToken = tokens[ ++cursor ] as Token;
    cursor++;
    const tagName = tagToken.payload;
    if (token.close) {
      let item: Stack;
      while (stack.length > 1) {
        item = stack.pop();
        if (tagName === item.tagName) {
          break;
        }
      }
      while (cursor < len) {
        const endToken = tokens[ cursor ];
        if (endToken.type !== 'tag-end') {
          break;
        }
        cursor++;
      }
      break;
    }
    if (arrayIncludes(options.closingTags, tagName)) {
      let currentIndex: number = stack.length - 1;
      while (currentIndex > 0) {
        if (tagName === stack[currentIndex].tagName) {
          stack = stack.slice(0, currentIndex);
          const previousIndex = currentIndex - 1;
          nodes = stack[previousIndex].children;
          break;
        }
        currentIndex = currentIndex - 1;
      }
    }

    let attributes: [string, string][] = [];
    let attrToken: {[prop: string]: any};
    while (cursor < len) {
      attrToken = tokens[cursor];
      if (attrToken.type === 'tag-end') {
        break;
      }
      const attrStr: string = attrToken.payload;
      let key: string;
      let value: string;
      if (stringIncludes(attrToken.payload, '=')) {
        const keyIndex = attrStr.indexOf('=');
        key = attrStr.slice(0, keyIndex);
        const tails = attrStr.slice(keyIndex + 1);
        if (tails.charAt(0) === '"' || tails.charAt(0) === '\'') {
          value = tails.slice(1, tails.length - 1);
        }
      } else {
        key = attrStr;
        value = 'true';
      }
      attributes.push([key, value]);
      cursor++;
    }
    cursor++;
    const children: Node[] = [];
    nodes.push({
      type: 'element',
      tagName: tagToken.payload,
      attributes,
      children,
    });

    const hasChildren = !(attrToken.close || arrayIncludes(options.voidTags, tagName));
    if (hasChildren) {
      stack.push({ tagName, children });
      const innerState: State = { tokens, options, cursor, stack };
      parse(innerState);
      cursor = innerState.cursor;
    }
  }
  state.cursor = cursor;
}
