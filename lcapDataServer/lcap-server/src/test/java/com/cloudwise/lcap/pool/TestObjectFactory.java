package com.cloudwise.lcap.pool;
import org.apache.commons.pool2.PooledObject;
import org.apache.commons.pool2.PooledObjectFactory;
import org.apache.commons.pool2.impl.DefaultPooledObject;

import java.util.concurrent.atomic.AtomicInteger;

/**
 * 在commons-pool2中有两种工厂：PooledObjectFactory 和 KeyedPooledObjectFactory
 * 创建TestObjectFactory 只需要继承 BasePooledObjectFactory 这个抽象类 ,而它则实现了PooledObjectFactory,
 * 也可以直接实现PooledObjectFactory接口
 */
public class TestObjectFactory implements PooledObjectFactory<TestObject> {

    private static volatile AtomicInteger count = new AtomicInteger(0);

    @Override
    public PooledObject<TestObject> makeObject() {
        TestObject testObject = new TestObject();
        testObject.setName("name" + count.getAndIncrement());
        return new DefaultPooledObject<>(testObject);
    }
    /**
     * 销毁对象
     *
     * @param p
     * @throws Exception
     */
    @Override
    public void destroyObject(PooledObject<TestObject> p) throws Exception {
        p.getObject().destroy();
    }
    /**
     * 验证对象是否可用
     *
     * @param p
     * @return
     */
    @Override
    public boolean validateObject(PooledObject<TestObject> p) {
        return p.getObject().isActive();
    }
    /**
     * 激活一个对象，使其可用用
     *
     * @param p
     * @throws Exception
     */
    @Override
    public void activateObject(PooledObject<TestObject> p) throws Exception {
        p.getObject().setActive(true);
    }
    /**
     * 钝化一个对象,也可以理解为反初始化
     *
     * @param p
     * @throws Exception
     */
    @Override
    public void passivateObject(PooledObject<TestObject> p) throws Exception {

    }
}

