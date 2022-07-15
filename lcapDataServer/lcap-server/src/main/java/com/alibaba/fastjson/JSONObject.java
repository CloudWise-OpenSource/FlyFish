package com.alibaba.fastjson;


import java.io.Serializable;
import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;
import java.util.*;

public class JSONObject implements Cloneable, Serializable, InvocationHandler {
    private static final long serialVersionUID = 1L;
    private static final int DEFAULT_INITIAL_CAPACITY = 16;
    private final Map<String, Object> map;

    public JSONObject() {
        this(16, false);
    }

    public JSONObject(Map<String, Object> map) {
        if (map == null) {
            throw new IllegalArgumentException("map is null.");
        } else {
            this.map = map;
        }
    }

    public JSONObject(boolean ordered) {
        this(16, ordered);
    }

    public JSONObject(int initialCapacity) {
        this(initialCapacity, false);
    }

    public JSONObject(int initialCapacity, boolean ordered) {
        if (ordered) {
            this.map = new LinkedHashMap(initialCapacity);
        } else {
            this.map = new HashMap(initialCapacity);
        }

    }


    public int size() {
        return this.map.size();
    }

    public boolean isEmpty() {
        return this.map.isEmpty();
    }


    public boolean containsKey(Object key) {
        boolean result = this.map.containsKey(key);
        if (!result && (key instanceof Number || key instanceof Character || key instanceof Boolean || key instanceof UUID)) {
            result = this.map.containsKey(key.toString());
        }

        return result;
    }


    public boolean containsValue(Object value) {
        return this.map.containsValue(value);
    }


    public Object get(Object key) {
        Object val = this.map.get(key);
        if (val == null && (key instanceof Number || key instanceof Character || key instanceof Boolean || key instanceof UUID)) {
            val = this.map.get(key.toString());
        }

        return val;
    }


    public Object getOrDefault(Object key, Object defaultValue) {
        Object v;
        return (v = this.get(key)) != null ? v : defaultValue;
    }


    public Object put(String key, Object value) {
        return this.map.put(key, value);
    }

    public JSONObject fluentPut(String key, Object value) {
        this.map.put(key, value);
        return this;
    }

    public void putAll(Map<? extends String, ?> m) {
        this.map.putAll(m);
    }

    public JSONObject fluentPutAll(Map<? extends String, ?> m) {
        this.map.putAll(m);
        return this;
    }


    public void clear() {
        this.map.clear();
    }

    public JSONObject fluentClear() {
        this.map.clear();
        return this;
    }


    public Object remove(Object key) {
        return this.map.remove(key);
    }

    public JSONObject fluentRemove(Object key) {
        this.map.remove(key);
        return this;
    }


    public Set<String> keySet() {
        return this.map.keySet();
    }


    public Collection<Object> values() {
        return this.map.values();
    }


    public Set<Map.Entry<String, Object>> entrySet() {
        return this.map.entrySet();
    }

    @Override
    public JSONObject clone() {
        return new JSONObject((Map)(this.map instanceof LinkedHashMap ? new LinkedHashMap(this.map) : new HashMap(this.map)));
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        } else {
            return obj instanceof JSONObject ? this.map.equals(((JSONObject)obj).map) : this.map.equals(obj);
        }
    }

    @Override
    public int hashCode() {
        return this.map.hashCode();
    }



    public Map<String, Object> getInnerMap() {
        return this.map;
    }


    @Override
    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
        return null;
    }
}