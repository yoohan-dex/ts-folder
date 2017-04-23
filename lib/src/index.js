"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lexer_1 = require("./lib/lexer");
var parser_1 = require("./lib/parser");
var format_1 = require("./lib/format");
var childlessTags = ['style', 'script', 'template'];
var closingTags = [
    'html', 'head', 'body', 'p', 'dt', 'dd', 'li', 'option',
    'thead', 'th', 'tbody', 'tr', 'td', 'tfoot', 'colgroup',
];
var voidTags = [
    '!doctype', 'area', 'base', 'br', 'col', 'command',
    'embed', 'hr', 'img', 'input', 'keygen', 'link',
    'meta', 'param', 'source', 'track', 'wbr',
];
exports.parseOption = {
    voidTags: voidTags,
    closingTags: closingTags,
    childlessTags: childlessTags,
};
function parse(str, options) {
    if (options === void 0) { options = exports.parseOption; }
    var tokens = lexer_1.default(str, options);
    var nodes = parser_1.default(tokens, options);
    return format_1.default(nodes);
}
exports.default = parse;
//# sourceMappingURL=index.js.map