/**
 * 加密库
 * @type {module.exports}
 */
const crypto = require('crypto');
/**
 * md5加密
 * @param data
 * @returns {PromiseLike<ArrayBuffer>}
 */
const md5 = (data) => {
    const hash = crypto.createHash('md5');
    hash.update(data.toString());

    return hash.digest('hex');
}

console.log(md5("tianjishuju!@#$"))
