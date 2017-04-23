export interface Options {
  childlessTags: string[];
  closingTags: string[];
  voidTags: string[];
}

export interface Lexicon {
  type: LexType;
}
export type LexType = 'text'|'comment'|'expression'|'tag-start'|'tag-end'|'tag'|'attribute';

export interface Text extends Lexicon {
  type: 'text';
  payload: string;
}

export interface Comment extends Lexicon {
  type: 'comment';
  payload: string;
}

export interface Expression extends Lexicon {
  type: 'expression';
  payload: string;
}

export interface TagS extends Lexicon {
  type: 'tag-start';
  close: boolean;
}
export interface TagE extends Lexicon {
  type: 'tag-end';
  close: boolean;
}

export interface Tag extends Lexicon {
  type: 'tag';
  payload: string;
}

export interface Attribute extends Lexicon {
  type: 'attribute';
  payload: string;
}

export type Token = Text|Comment|Expression|Tag|Attribute;
export type ArrowToken = TagS|TagE;
export type Tokens = (Token|ArrowToken)[];

export interface Node {
  type: 'element'|'component'|'text'|'comment';
  tagName: string;
  content?: string;
  children?: Nodes;
  attributes?: string[];
}
export type Nodes = Node[];



