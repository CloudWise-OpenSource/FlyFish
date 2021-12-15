/**
 * 统一key标识
 * @param {string} key
 * @returns {string}
 */
const mkKey = (key) => (think.config('custom.cacheKeyPrefix') || "") + '_' + key;


/**
 * redis 缓存操作
 * 备注： 如果需要用到redis的更高级的语法， 可以基于https://github.com/luin/ioredis 重新封装当前的cache类
 *
 * @type {module.exports}
 */
module.exports = class extends think.Service{

    /**
     * 设置缓存
     * @param {String} key
     * @param {Mixed} value
     * @param {Number} expire // 过期时间单位是“毫秒”
     * @returns {Promise<void>}
     */
    async set(key, value, expire = 10 * 60 * 1000) {
        await think.cache(mkKey(key), value, {
            type: 'redis',
            redis: {
                timeout: expire
            }
        });
    }

    /**
     * 设置永不过期的缓存
     * @param {String} key
     * @param {Mixed} value
     * @returns {Promise<void>}
     */
    async setForever(key, value) {
        return await this.set(mkKey(key), value, 24 * 3600 * 1000 * 365 * 1000);
    }

    /**
     * 获取缓存
     * @param {String} key
     * @returns {Promise<*>}
     */
    async get(key) {
        return await think.cache(mkKey(key), undefined, 'redis');
    }

    /**
     * 删除缓存
     * @param {String} key
     * @returns {Promise<*>}
     */
    async del(key) {
        return await think.cache(mkKey(key), null, 'redis');
    }

}
