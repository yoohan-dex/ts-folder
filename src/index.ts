import lexer from './lib/lexer';
import parser from './lib/parser';

import { default as format, Tree } from './lib/format';
import { Options } from './lib/typings';


const childlessTags = [ 'style', 'script', 'template' ];

const closingTags = [
  'html', 'head', 'body', 'p', 'dt', 'dd', 'li', 'option',
  'thead', 'th', 'tbody', 'tr', 'td', 'tfoot', 'colgroup',
];

const voidTags = [
  '!doctype', 'area', 'base', 'br', 'col', 'command',
  'embed', 'hr', 'img', 'input', 'keygen', 'link',
  'meta', 'param', 'source', 'track', 'wbr',
];


export const parseOption = {
  voidTags,
  closingTags,
  childlessTags,
};

/**
 * parse the REML and return a ast tree
 * @param str the original html string
 * @param options the compiler options
 */
export default function parse(str: string, options: Options = parseOption): Tree[] {
  const tokens = lexer(str, options);
  const nodes = parser(tokens, options);
  return format(nodes);
}

