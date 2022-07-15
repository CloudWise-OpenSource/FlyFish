package com.cloudwise.lcap.pool;

import org.apache.commons.pool2.impl.GenericObjectPoolConfig;


public class TestCase {
    public static void main(String[] args) {
        TestObject testObject = null;
        try {
            testObject = pool.borrowObject();
            System.out.println(testObject.getName());
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (testObject != null) {
                //最终归还对象到对象池
                pool.returnObject(testObject);
            }
        }
    }

    public static int maxIdle = 5;
    public static int maxTotal = 20;
    public static int minIdle = 2;
    public static int initialSize = 3;
    static TestObjectPool pool = faceSDKPool();
    public static TestObjectPool faceSDKPool() {
        TestObjectFactory faceSDKFactory = new TestObjectFactory();
        //设置对象池的相关参数
        GenericObjectPoolConfig<TestObject> poolConfig = new GenericObjectPoolConfig<>();
        poolConfig.setMaxIdle(maxIdle);
        poolConfig.setMaxTotal(maxTotal);
        poolConfig.setMinIdle(minIdle);
        poolConfig.setBlockWhenExhausted(true);
        poolConfig.setTestOnBorrow(true);
        poolConfig.setTestOnReturn(true);
        poolConfig.setTestWhileIdle(true);
        poolConfig.setTimeBetweenEvictionRunsMillis(1000 * 60 * 30);
        //一定要关闭jmx，不然springboot启动会报已经注册了某个jmx的错误
        poolConfig.setJmxEnabled(false);

        //新建一个对象池,传入对象工厂和配置
        pool = new TestObjectPool(faceSDKFactory, poolConfig);
        //init
        int size = Math.min(initialSize, maxTotal);
        for (int i = 0; i < size; i++) {
            try {
                pool.addObject();
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        }
        return pool;
    }
}
