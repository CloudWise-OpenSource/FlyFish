package com.cloudwise.lcap.source.dao;

import com.cloudwise.lcap.source.model.ResourceImportRecords;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class ResourceDao {

    @Autowired
    private MongoTemplate mongoTemplate;

    public ResourceImportRecords getById(String id) {
        ResourceImportRecords recordInfo = mongoTemplate.findById(id, ResourceImportRecords.class);
        return recordInfo;
    }

    /**
     * 删除
     */


    /**
     * 修改
     */
}
