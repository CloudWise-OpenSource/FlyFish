package com.cloudwise.lcap.source.dao;

import cn.hutool.core.collection.CollectionUtil;
import com.cloudwise.lcap.source.model.Application;
import org.apache.commons.lang3.StringUtils;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Repository
public class ApplicationDao {

    @Autowired
    private MongoTemplate mongoTemplate;

    /**
     * 新增应用
     *
     * @return
     */
    public Application insert(Application application) {
        return mongoTemplate.save(application);
    }

    public void upsert(Application application) {
        Query query = new Query(Criteria.where("_id").is(application.getId()));
        Update update = new Update();
        update.set("update_time",new Date());

        if (StringUtils.isNotEmpty(application.getAccountId())){
            update.set("account_id",application.getAccountId());
        }

        if (CollectionUtil.isNotEmpty(application.getTags())){
            update.set("tags",application.getTags());
        }
        if (StringUtils.isNotEmpty(application.getDevelopStatus())){
            update.set("develop_status",application.getDevelopStatus());
        }
        if (StringUtils.isNotBlank(application.getCover())){
            update.set("cover",application.getCover());
        }
        if (StringUtils.isNotBlank(application.getStatus())){
            update.set("status",application.getStatus());
        }
        if (CollectionUtil.isNotEmpty(application.getPages())){
            update.set("pages",application.getPages());
        }
        if (StringUtils.isNotEmpty(application.getName())){
            update.set("name",application.getName());
        }
        if (StringUtils.isNotBlank(application.getProjectId())){
            update.set("project_id",application.getProjectId());
        }
        if (StringUtils.isNotBlank(application.getType())){
            update.set("type",application.getType());
        }
        if (null != application.getIsLib()){
            update.set("is_lib",application.getIsLib());
        }
        if (null != application.getIsRecommend()){
            update.set("is_recommend",application.getIsRecommend());
        }
        mongoTemplate.upsert(query,update,Application.class);
    }

    public void update(Application application) {
        ObjectId id = application.getId();
        Query query = new Query(Criteria.where("_id").is(id));
        Update update = new Update();
        update.set("update_time",new Date());
        if (StringUtils.isNotBlank(application.getName())){
            update.set("name",application.getName());
        }
        if (null != application.getIsLib()){
            update.set("is_lib",application.getIsLib());
        }
        if (application.getIsRecommend()){
            update.set("is_recommend",application.getIsRecommend());
        }
        if (CollectionUtil.isNotEmpty(application.getTags())){
            update.set("tags",application.getTags());
        }
        if (StringUtils.isNotBlank(application.getProjectId())){
            update.set("project_id",application.getProjectId());
        }
        if (StringUtils.isNotBlank(application.getCover())){
            update.set("cover",application.getCover());
        }
        if (StringUtils.isNotBlank(application.getType())){
            update.set("type",application.getType());
        }
        if (CollectionUtil.isNotEmpty(application.getPages())){
            update.set("pages",application.getPages());
        }

        mongoTemplate.updateFirst(query, update, Application.class);
    }

    /**
     * 根据id查新
     */
    public Application findById(String applicationId) {
        return mongoTemplate.findById(applicationId, Application.class);
    }



    /**
     * 根据id列表查询
     */
    public List<Application> findById(List<String> applicationIds) {
        List<ObjectId> objectIds = new ArrayList<>();
        for (String applicationId : applicationIds) {
            ObjectId objectId = new ObjectId(applicationId);
            objectIds.add(objectId);
        }
        Query query = new Query(Criteria.where("_id").in(objectIds).and("status").is("valid"));
        return mongoTemplate.find(query, Application.class);
    }

    /**
     * 根据name获取应用信息
     */
    public Application findByName(String name){
        Query query = new Query(Criteria.where("name").is(name).and("status").is("valid"));
        return mongoTemplate.findOne(query, Application.class);
    }

    public List<Application> findByNames(List<String> names){
        Query query = new Query(Criteria.where("name").in(names).and("status").is("valid"));
        return mongoTemplate.find(query, Application.class);
    }

    /**
     * 根据name(去掉id)获取应用信息
     */
    public Application findByNameAndId(String name, String id) {

        Query query = new Query(Criteria.where("name").is(name).and("status").is("valid").and("_id").ne(new ObjectId(id)));
        return mongoTemplate.findOne(query, Application.class);
    }

}
