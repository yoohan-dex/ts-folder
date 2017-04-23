import { Nodes } from './typings';

export type Styles = {
  [prop: string]: any,
};

export interface Attr {
  condition?: string;
  loop?: string;
  className?: string[];
  dataset?: {
    [ prop: string ]: string | number;
  };
  styles?: Styles;
  [prop: string]: any;
}

export interface Tree {
  type: string;
  tagName: string;
  attributes: Attr;
  children: Tree[]|any[];
}

export default function format(nodes: Nodes): Tree[]|any[] {
  return nodes.map(node => {
    if (node.type === 'element' || node.type === 'component') {
      const type = capitialize(node.type);
      const tagName = node.tagName;
      const attributes = formatAttributes(node.attributes as string[]);
      const children = format(node.children);
      return {
        type,
        tagName,
        attributes,
        children,
      };
    } else {
      return undefined;
    }
  });
}

export function capitialize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function splitHead(str: string, sep: string): [ string, string ] {
  const idx = str.indexOf(sep);
  if (idx === -1) {
    return [ str, '' ];
  }
  return [ str.slice(0, idx), str.slice(idx + sep.length) ];
}

export function unquote(str: string): string {
  const car = str.charAt(0);
  const end = str.length - 1;
  const isQuoteStart = car === '"' || car === '\'';
  if (isQuoteStart && car === str.charAt(end)) {
    return str.slice(1, end);
  }
  return str;
}

export function formatStatyles(str: string): Styles {
  const initalStyle: Styles = {};
  return str.trim().split(';')
    .map(rule => rule.trim().split(':'))
    .reduce((styles, keyAndValue) => {
      const [ rawKey, rawValue ] = keyAndValue;
      if (rawValue && rawValue.indexOf('{{') !== -1 && rawValue.indexOf('}}') !== -1) {
        const key = camelCase(rawKey.trim());
        const value = castValue(rawValue.trim());
        styles[ key ] = value;
      } else if (rawValue) {
        const key = camelCase(rawKey.trim());
        const value = rawValue.trim();
        styles[ key ] = value;
      }
      return styles;
    }, initalStyle);
}

export function camelCase(str: string): string {
  return str.split('-').reduce((finalStr, word) => {
    return finalStr + capitialize(word);
  });
}
export function castValue(str: any): string | number {
  if (typeof str !== 'string' || str === '') {
    return str;
  }
  const num = +str;
  if (!isNaN(num)) {
    return num;
  }
  return str;
}

export function isExpression(str: string): boolean {
  return (str.startsWith('{{')) && (str.endsWith('}}'));
}

export function unCurly(str: string): string {
  if (isExpression(str)) {
    return str.slice(2).slice(0, str.length - 4); // '{{}}'.length
  }
  return str;
}

export function formatAttributes(attributes: string[]): Attr {
  const initialAttrs: Attr = {};
  return attributes.reduce((attrs, pair) => {
    let [ key, value ] = splitHead(pair.trim(), '=');
    value = value ? unquote(value) : key;
    if (key === 'class') {
      attrs.className = value.split(' ');
    } else if (key === 'style') {
      attrs.styles = formatStatyles(value);
    } else if (key.startsWith('data-')) {
      attrs.dataset = attrs.dataset || {};
      const prop = camelCase(key.slice(5));
      attrs.dataset[ prop ] = castValue(value);
    } else if (key.startsWith('re:if')) {
      attrs.condition = unCurly(value);
    } else if (key.startsWith('re:for')) {
      attrs.loop = unCurly(value);
    } else if (key === 'id') {
      return attrs;
    } else {
      attrs[ camelCase(key) ] = castValue(value);
    }
    return attrs;
  }, initialAttrs);
}


