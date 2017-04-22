"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("./utils");
function lexer(str, options) {
    var state = { str: str, options: options, cursor: 0, tokens: [] };
    lex(state);
    return state.tokens;
}
exports.default = lexer;
function lex(state) {
    var str = state.str;
    var len = str.length;
    while (state.cursor < len) {
        var isText = str.charAt(state.cursor) !== '<';
        if (isText) {
            lexText(state);
            continue;
        }
        var isComment = utils_1.startWith(str, '!--', state.cursor + 1);
        if (isComment) {
            lexComment(state);
            continue;
        }
    }
}
exports.lex = lex;
function lexText(state) {
    var str = state.str, cursor = state.cursor;
    var textEnd = str.indexOf('<', cursor);
    var type = 'text';
    var isExpresson = utils_1.startWith(str, '{{', state.cursor);
    if (isExpresson) {
        var expPosition = str.indexOf('{{', cursor);
        var content = str.slice(cursor, expPosition);
        if (content) {
            state.tokens.push({ type: type, content: content });
        }
        lexExpression(state);
        lexText(state);
    }
    else {
        var content = str.slice(cursor, textEnd);
        state.tokens.push({ type: type, content: content });
    }
}
exports.lexText = lexText;
function lexExpression(state) {
    var str = state.str, cursor = state.cursor;
    var expressionStart = cursor + 2;
    var expressionEnd = str.indexOf('}}', cursor);
    var type = 'expression';
    var content = str.slice(expressionStart, expressionEnd);
    state.cursor = expressionEnd + 2;
    state.tokens.push({ type: type, content: content });
}
exports.lexExpression = lexExpression;
function lexComment(state) {
    state.cursor += 4;
    var str = state.str, cursor = state.cursor;
    var commentEnd = str.indexOf('-->', cursor);
    var type = 'comment';
    if (commentEnd === -1) {
        var content_1 = str.slice(cursor);
        state.cursor = str.length;
        state.tokens.push({ type: type, content: content_1 });
        return;
    }
    var content = str.slice(cursor, commentEnd);
    state.cursor = commentEnd + 3;
    state.tokens.push({ type: type, content: content });
}
exports.lexComment = lexComment;
function lexTag(state) {
    var str = state.str;
    {
        var secondChar = str.charAt(state.cursor + 1);
        var close_1 = secondChar === '/';
        state.tokens.push({ type: 'tag-start', close: close_1 });
        state.cursor += close_1 ? 2 : 1;
    }
    var tagName = lexTagName(state);
    lexTagAttributes(state);
    {
        var firstChar = str.charAt(state.cursor);
        var close_2 = firstChar === '/';
        state.tokens.push({ type: 'tag-end', close: close_2 });
        return tagName;
    }
}
exports.lexTag = lexTag;
function lexTagName(state) {
    var str = state.str, cursor = state.cursor;
    var len = str.length;
}
exports.lexTagName = lexTagName;
//# sourceMappingURL=lexer.js.map