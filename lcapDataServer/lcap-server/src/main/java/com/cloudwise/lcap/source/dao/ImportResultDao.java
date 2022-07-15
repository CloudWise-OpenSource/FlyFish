package com.cloudwise.lcap.source.dao;


import com.cloudwise.lcap.source.model.ImportResult;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public class ImportResultDao {

    @Autowired
    private MongoTemplate mongoTemplate;

    /**
     * 写入结果
     */
    public ImportResult insert(ImportResult result) {
        return mongoTemplate.save(result);
    }

    /**
     * 根据key获取导入结果
     */
    public List<ImportResult> findByKey(String key) {
        Query query = new Query();
        if (StringUtils.isNotBlank(key)){
            query.addCriteria(Criteria.where("key").is(key).and("status").is("1"));
        }
        query.with(Sort.by("update_time").descending());
        return mongoTemplate.find(query, ImportResult.class);
    }

    public void upsert(ImportResult result) {
        Query query = new Query(Criteria.where("key").is(result.getKey()));
        Update update = new Update();
        update.set("update_time",new Date());

        if (StringUtils.isNotBlank(result.getStatus())){
            update.set("status",result.getStatus());
        }

        if (StringUtils.isNotBlank(result.getCreator())){
            update.set("creator",result.getCreator());
        }

        if (StringUtils.isNotBlank(result.getType())){
            update.set("type",result.getType());
        }

        if (StringUtils.isNotBlank(result.getUpdater())){
            update.set("updater",result.getUpdater());
        }

        mongoTemplate.upsert(query, update, ImportResult.class);
    }

}