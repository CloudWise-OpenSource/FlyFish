package com.cloudwise.lcap.source.dao;

import com.cloudwise.lcap.source.model.User;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class UserDao {

    @Autowired
    private MongoTemplate mongoTemplate;

    public List<User> findByName(String name) {
        Query query = new Query();
        if (StringUtils.isNotBlank(name)){
            query.addCriteria(Criteria.where("username").is(name));
        }
        query.with(Sort.by("update_time").descending());
        return mongoTemplate.find(query, User.class);
    }

    public List<User> findAll() {
        Query query = new Query();
        query.with(Sort.by("update_time").descending());
        return mongoTemplate.find(query, User.class);
    }

}
