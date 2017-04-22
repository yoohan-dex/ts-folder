

/**
 * Check a string if including another string from scratch
 *
 * @param str the target string as haystack
 * @param searchStr the string searching as a needle
 * @param position the start seaching postion in the target string
 *
 */
function startWith(str: string, searchStr: string, position?: number): boolean {
  return str.substr(position || 0, searchStr.length) === searchStr;
}

/**
 * Check a string if including another string from end
 *
 * @param str the target string as haystack
 * @param searchStr  the string searching as a needle
 * @param position the start seaching postion in the target string
 */
function endWith(str: string, searchStr: string, position?: number): boolean {
  const index = (position || str.length) - searchStr.length;
  const lastIndex = str.lastIndexOf(searchStr, index);
  return lastIndex !== -1 && lastIndex === index;
}

/**
 * Check a string if including another string
 *
 * @param str the target string as haystack
 * @param searchStr the string searching as a needle
 * @param position the start seaching postion in the target string
 */
function stringIncludes(str: string, searchStr: string, position?: number): boolean {
  return str.indexOf(searchStr, position || 0) !== -1;
}

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
  startWith,
  endWith,
  stringIncludes,
  isRealNaN,
  arrayIncludes,
};
