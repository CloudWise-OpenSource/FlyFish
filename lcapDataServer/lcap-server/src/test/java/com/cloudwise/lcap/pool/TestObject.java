package com.cloudwise.lcap.pool;


/**
 * 需要池化的对象
 *
 * @author lz
 * @date 2019/7/30
 */
public class TestObject {
    private String name;
    private boolean isActive;

    public TestObject() {
    }

    public TestObject(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        isActive = active;
    }

    public void destroy(){

    }
}

