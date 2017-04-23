"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isRealNaN(x) {
    return typeof x === 'number' && isNaN(x);
}
exports.isRealNaN = isRealNaN;
function arrayIncludes(array, searchEle, position) {
    var len = array.length;
    if (len === 0) {
        return false;
    }
    var lookupIndex = position || 0;
    var isNaNEle = isRealNaN(searchEle);
    var searchIndex = lookupIndex >= 0 ? lookupIndex : len + lookupIndex;
    while (searchIndex < len) {
        var ele = array[searchIndex++];
        if (ele === searchEle) {
            return true;
        }
        if (isNaNEle && isRealNaN(ele)) {
            return true;
        }
    }
    return false;
}
exports.arrayIncludes = arrayIncludes;
//# sourceMappingURL=utils.js.map