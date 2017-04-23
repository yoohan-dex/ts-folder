import { Tree } from './lib/format';
import { Options } from './lib/typings';
export declare const parseOption: {
    voidTags: string[];
    closingTags: string[];
    childlessTags: string[];
};
export default function parse(str: string, options?: Options): Tree[];
