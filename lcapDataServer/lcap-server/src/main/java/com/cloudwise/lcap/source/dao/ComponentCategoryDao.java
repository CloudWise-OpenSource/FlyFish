package com.cloudwise.lcap.source.dao;

import com.cloudwise.lcap.source.model.ComponentCategory;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class ComponentCategoryDao {

    @Autowired
    private MongoTemplate mongoTemplate;

    /**
     * 根据ids批量获取应用信息
     */
    public List<ComponentCategory> findAll(String categoryName) {
        Query query = new Query();
        if (StringUtils.isNotBlank(categoryName)){
            query.addCriteria(Criteria.where("categories.name").regex(categoryName));
        }
        query.with(Sort.by("update_time").descending());
        return mongoTemplate.find(query, ComponentCategory.class);
    }


    public List<ComponentCategory> findCategoryById(String id) {
        Query query = new Query();
        if (StringUtils.isNotBlank(id)){
            query.addCriteria(Criteria.where("categories.id").is(id));
        }
        query.with(Sort.by("update_time").descending());
        return mongoTemplate.find(query, ComponentCategory.class);
    }

}
