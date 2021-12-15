/**
 * 加密库
 * @type {module.exports}
 */
const crypto = require('crypto');

module.exports = class extends think.Service{

    /**
     * 对称加密
     * @param {String | Number} data [加密数据]
     * @param {String | Number} key [秘钥]
     */
    aesEncrypt(data, key) {
        const cipher = crypto.createCipher('aes192', key.toString());
        let crypted = cipher.update(data.toString(), 'utf8', 'hex');
        crypted += cipher.final('hex');
        return crypted;
    }

    /**
     * 对称解密
     * @param {String | Number} datencrypted [解密数据]
     * @param {String | Number} key [秘钥]
     */
    aesDecrypt(encrypted, key) {
        const decipher = crypto.createDecipher('aes192', key.toString());
        let decrypted = decipher.update(encrypted.toString(), 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    }


    /**
     * md5加密
     * @param data
     * @returns {PromiseLike<ArrayBuffer>}
     */
    md5(data) {
        const hash = crypto.createHash('md5');
        hash.update(data.toString());

        return hash.digest('hex');
    }

}