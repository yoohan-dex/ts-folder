export interface Options {
    childlessTags: string[];
    closingTags: string[];
    voidTags: string[];
    loopTag: string;
    ComponentTags: string[];
    format: Function;
}
export interface Node {
    type: NodeType;
}
export declare type NodeType = 'text' | 'comment' | 'expression' | 'tag-start' | 'tag-end' | 'tag' | 'attribute';
export interface Text extends Node {
    type: 'text';
    content: string;
}
export interface Comment extends Node {
    type: 'comment';
    content: string;
}
export interface Expression extends Node {
    type: 'expression';
    content: string;
}
export interface TagS extends Node {
    type: 'tag-start';
    close: boolean;
}
export interface TagE extends Node {
    type: 'tag-end';
    close: boolean;
}
export interface Tag extends Node {
    type: 'tag';
    content: string;
}
export declare type Tokens = (Text | Comment | Expression | TagS | TagE | Tag)[];
