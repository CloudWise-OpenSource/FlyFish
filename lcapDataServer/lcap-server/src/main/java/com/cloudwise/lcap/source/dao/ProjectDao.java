package com.cloudwise.lcap.source.dao;


import com.cloudwise.lcap.source.model.Project;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

import static com.cloudwise.lcap.common.contants.Constant.SPECIAL_PROJECT_FROM;

@Repository
public class ProjectDao {

    @Autowired
    private MongoTemplate mongoTemplate;

    public Project findByProjectId(ObjectId id) {
        return  mongoTemplate.findById(id,Project.class);
    }

    /**
     * 根据ids批量获取项目信息
     */
    public List<Project> findByIds(List<String> ids) {
        List<ObjectId> list = new ArrayList<>();
        for (String id : ids) {
            list.add(new ObjectId(id));
        }

        Query query = new Query(Criteria.where("_id").in(list));
        return mongoTemplate.find(query, Project.class);
    }


    public Project findByInitProject(){

        Criteria criteria = Criteria.where("status").is("valid").and("from").is(SPECIAL_PROJECT_FROM);
        Query query = new Query(criteria);
        return mongoTemplate.findOne(query, Project.class);
    }
}