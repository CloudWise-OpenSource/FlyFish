package com.cloudwise.lcap.commonbase.handler;

import com.baomidou.mybatisplus.core.handlers.MetaObjectHandler;
import com.cloudwise.lcap.commonbase.threadlocal.ThreadLocalContext;
import com.cloudwise.lcap.commonbase.util.Snowflake;
import lombok.extern.slf4j.Slf4j;
import org.apache.ibatis.reflection.MetaObject;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
@Slf4j
public class BaseEntityHandler implements MetaObjectHandler {

    @Override
    public void insertFill(MetaObject metaObject) {
        Date ldt = new Date();
        if (metaObject.hasGetter("id") && metaObject.getValue("id") == null) {
            metaObject.setValue("id", Snowflake.INSTANCE.nextId().toString());
        }
        metaObject.setValue("createTime", ldt);
        metaObject.setValue("updateTime", ldt);
        if (metaObject.hasGetter("creator") && metaObject.getValue("creator") == null) {
            metaObject.setValue("creator", ThreadLocalContext.getUserId());
        }
        if (metaObject.hasGetter("updater") && metaObject.getValue("updater") == null) {
            metaObject.setValue("updater", ThreadLocalContext.getUserId());
        }
        if (metaObject.hasGetter("accountId") && metaObject.getValue("accountId") == null) {
            metaObject.setValue("accountId", ThreadLocalContext.getAccountId());
        }
    }

    @Override
    public void updateFill(MetaObject metaObject) {
        metaObject.setValue("updateTime", new Date());
        if (metaObject.hasGetter("updater") && metaObject.getValue("updater") == null) {
            metaObject.setValue("updater", ThreadLocalContext.getUserId());
        }
    }
}
