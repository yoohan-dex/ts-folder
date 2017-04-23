/**
 * Check x if really is not NaN
 *
 * @param x string or a number
 */
function isRealNaN(x: any) {
  return typeof x === 'number' && isNaN(x);
}

/**
 * Check an array if including an element searching
 *
 * @param array the target array as haystack
 * @param searchEle the element searching as a needle
 * @param position the start seaching postion in the target array
 */
function arrayIncludes(array: any[], searchEle: number | string, position?: number): boolean {
  const len = array.length;
  if (len === 0) {
    return false;
  }

  const lookupIndex = position || 0;
  const isNaNEle = isRealNaN(searchEle);
  let searchIndex = lookupIndex >= 0 ? lookupIndex : len + lookupIndex;
  while (searchIndex < len) {
    const ele = array[searchIndex++];
    if (ele === searchEle) {
      return true;
    }
    if (isNaNEle && isRealNaN(ele)) {
      return true;
    }
  }
  return false;
}

export {
  isRealNaN,
  arrayIncludes,
};
