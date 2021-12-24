/**
 * @description 本地存储辅助函数
 * @author vision <vision.shi@tianjishuju.com>
 * @license www.tianjishuju.com/license
 */

import { isNull, isUndefined, each, eachRight, now } from 'lodash';

const isNone = value => (isNull(value) || isUndefined(value));


// 本地存储的key
const STORAGE_KEY = '__storage__';

/**
 * 临时存储的变量
 * @type {Object}
 */
const storageValue = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};

/**
 * 更新localStorage
 */
const update = () => localStorage.setItem(STORAGE_KEY, JSON.stringify(storageValue));

/**
 * 判断是否已过期
 * @param expire
 * @returns {boolean}
 */
const isExpired = expire => !isNone(expire) && expire !== 0 && expire - now() < 0;

/**
 * 存储本地数据
 * @param {string} key 数据名
 * @param {*} value 值
 * @param {number|Date} [expire] 过期时间,不传或0,表示永不过期
 * @return {boolean}
 */
export const setStorage = (key, value, expire) => {
    // 值不是null(是null没意义,浪费空间),并且没有过期
    if (!isNone(value) && !isExpired(expire)) {
        storageValue[key] = {
            value,
            expire // 设置过期时间
        };

        update();
        return true;
    }

    return false;
};

/**
 * 获取本地数据
 * @param {string} key 数据名
 * @returns {*}
 */
export const getStorage = (key) => {

    const storage = storageValue[key];

    if (!isNone(storage) && !isExpired(storage.expire)) {

        return isNone(storage.value) ? null : storage.value;
    }

    return null;
};

/**
 * 给localStorage续期
 * @param {string} key 数据名
 * @param {number|Date} expTime 过期时间
 */
export const keepStorage = (key, expTime) => setStorage(key, getStorage(key), expTime);

/**
 * 删除本地数据
 * @param {string} key 数据名
 * @return {boolean}
 */
export const removeStorage = (key) => {

    const storage = getStorage(key);

    if (storage) {

        delete storageValue[key];

        update();
    }

    return true;
};

/**
 * 清空本地数据
 */
export const clearStorage = () => eachRight(storageValue, removeStorage);

// 每次打开页面时, 清空一次过期的数据
each(storageValue, (storage, key) => {
    if (isExpired(storage.expire)) {
        delete storageValue[key];
    }
});
update();
