import { Options, Tokens } from './typings';
export interface State {
    str: string;
    options?: Options;
    cursor: number;
    tokens: Tokens;
}
export default function lexer(str: string, options: Options): Tokens;
export declare function lex(state: State): void;
export declare function lexText(state: State): void;
export declare function lexExpression(state: State): void;
export declare function lexComment(state: State): void;
export declare function lexTag(state: State): string;
export declare function lexTagName(state: State): string;
export declare function lexTagAttributes(state: State): void;
export declare function lexSkipTag(tagName: string, state: State): void;
