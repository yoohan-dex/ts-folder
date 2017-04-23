export interface Options {
    childlessTags: string[];
    closingTags: string[];
    voidTags: string[];
}
export interface Lexicon {
    type: LexType;
}
export declare type LexType = 'text' | 'comment' | 'expression' | 'tag-start' | 'tag-end' | 'tag' | 'attribute';
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
export declare type Token = Text | Comment | Expression | Tag | Attribute;
export declare type ArrowToken = TagS | TagE;
export declare type Tokens = (Token | ArrowToken)[];
export interface Node {
    type?: 'element' | 'component' | 'text' | 'comment' | 'root';
    tagName: string;
    content?: string;
    children: Nodes | any[];
    attributes?: string[];
}
export declare type Nodes = Node[];
