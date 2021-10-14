import { merge } from "data-vi/helpers";

/**
 * @description noop
 */
export const noop = () => {};

/**
 * @description 判断数组类型(比如返回`string`则为string[], 依次类推)
 */
export const checkArrayType = (array) => {
  if (!array || !array.length) {
    console.warn("typeof args must be array object[], not empty");
    return false;
  }
  const [item] = array;
  return Object.prototype.toString
    .call(item)
    .match(/\[object ([A-Z][a-z]+)\]/)[1];
};

/**
 * @description 匹配函数体
 * @param {string} value
 * @returns
 */
export const matchFunctionBody = (value = "") => {
  value = value.replace(/\n/g, "");
  const reg = /\{([\s\S]*)\}/;
  const markParam = /\(([^\)]*)\)/;
  let params = (value.match(markParam)[1] || "")
    .split(",")
    .map((v) => v.replaceAll(" ", ""));

  return [params.length > 1 ? params : params[0], value.match(reg)[1] || ""];
};

/**
 * @description 首字母大写
 * @param {string} word
 * @returns
 */
export const upperCaseIndentWord = (word) => {
  const wordArray = word.split("");
  if (wordArray.length >= 1) {
    wordArray.splice(0, 1, wordArray[0].toUpperCase());
  }
  return wordArray.join("");
};

export const formatFunctionsToOption = (functions = {}) => {
  let options = {};
  Object.entries(functions).forEach(([key, value]) => {
    const realKey = key.split(".");
    const [functionParams, functionBody] = matchFunctionBody(value);
    const params = [functionParams].flat();
    const formatterFunction = new Function(...params, functionBody);
    const initReduce = { [[...realKey].pop()]: formatterFunction };
    const formatObject = realKey
      .slice(0, -1)
      .reverse()
      .reduce((reduce, currentKey) => ({ [currentKey]: reduce }), initReduce);
    options = merge({}, options, formatObject);
  });
  return options;
};
