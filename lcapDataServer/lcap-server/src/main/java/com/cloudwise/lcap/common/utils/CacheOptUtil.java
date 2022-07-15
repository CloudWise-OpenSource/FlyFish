package com.cloudwise.lcap.common.utils;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Component;

@Lazy
@Component
public class CacheOptUtil {
    private static final String objectCacheStr = "objectCache";
    @Lazy
    @Autowired
    private CacheManager cacheManager;

    /**
     * 设置缓存对象
     *
     * @param cacheManager
     * @param key
     * @param object
     */
    public static void setCache(CacheManager cacheManager, String key, Object object) {
        Cache cache = cacheManager.getCache(objectCacheStr);
        cache.put(key, object);
    }

    /**
     * 设置缓存对象
     *
     * @param cacheName
     * @param cacheManager
     * @param key
     * @param object
     */
    public static void setCache(String cacheName, CacheManager cacheManager, String key, Object object) {
        Cache cache = cacheManager.getCache(cacheName);
        cache.put(key, object);
    }

    /**
     * 从缓存中取出对象
     *
     * @param cacheManager
     * @param key
     * @return
     */
    public static Object getCache(CacheManager cacheManager, String key) {
        Object object = null;
        Cache cache = cacheManager.getCache(objectCacheStr);
        if (cache.get(key) != null && !cache.get(key).equals("")) {
            object = cache.get(key).get();
        }
        return object;
    }

    /**
     * 从缓存中取出对象
     *
     * @param cacheManager
     * @param key
     * @return
     */
    public static Object getCache(String cacheName, CacheManager cacheManager, String key) {
        Object object = null;
        Cache cache = cacheManager.getCache(cacheName);
        if (cache.get(key) != null && !cache.get(key).equals("")) {
            object = cache.get(key).get();
        }
        return object;
    }

    /**
     * 清除所有缓存
     *
     * @param cacheManager
     * @return
     */
    public static void clearAll(CacheManager cacheManager) {
        Cache cache = cacheManager.getCache(objectCacheStr);
        cache.clear();
//        cache.removeAll();
    }

    /**
     * 清除所有缓存
     *
     * @param cacheManager
     * @return
     */
    public static void clearAll(String cacheName, CacheManager cacheManager) {
        Cache cache = cacheManager.getCache(cacheName);
        cache.clear();
    }

    /**
     * 移除指定的key
     *
     * @param cacheManager
     * @param key          缓存key
     * @return
     */
    public static Boolean removeKey(CacheManager cacheManager, String key) {
        Cache cache = cacheManager.getCache(objectCacheStr);
        cache.evict(key);
        return true;
    }

    /**
     * 移除指定的key
     *
     * @param cacheManager
     * @param key          缓存key
     * @return
     */
    public static Boolean removeKey(String cacheName, CacheManager cacheManager, String key) {
        Cache cache = cacheManager.getCache(cacheName);
        cache.evict(key);
        return true;
    }

    public Object getCache(String key) {
        Cache cache = cacheManager.getCache(objectCacheStr);
        return cache.get(key).get();
    }

    public void setCache(String key, Object object) {
        Cache cache = cacheManager.getCache(objectCacheStr);
        cache.put(key, object);
    }

    public Object getCache(String cacheName, String key) {
        Cache cache = cacheManager.getCache(cacheName);
        return cache.get(key).get();
    }

    public void setCache(String cacheName, String key, Object object) {
        Cache cache = cacheManager.getCache(cacheName);
        cache.put(key, object);
    }

    public Boolean removeKey(String key) {
        Cache cache = cacheManager.getCache(objectCacheStr);
        cache.evict(key);
        return true;
    }

    public Boolean removeKey(String cacheName, String key) {
        Cache cache = cacheManager.getCache(cacheName);
        cache.evict(key);
        return true;
    }
}
