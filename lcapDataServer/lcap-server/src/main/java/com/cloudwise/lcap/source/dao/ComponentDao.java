package com.cloudwise.lcap.source.dao;

import cn.hutool.core.collection.CollectionUtil;
import com.cloudwise.lcap.source.model.Component;
import org.apache.commons.lang3.StringUtils;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.List;

@Repository
public class ComponentDao {
    @Autowired
    private MongoTemplate mongoTemplate;

    public Component insert(Component component) {
        return mongoTemplate.save(component);
    }

    public void upsert(Component component) {
        Query query = new Query(Criteria.where("_id").is(component.getId()));
        Update update = new Update();
        update.set("update_time",new Date());
        if (StringUtils.isNotBlank(component.getCreator())) {
            update.set("creator",component.getCreator());
        }

        if (StringUtils.isNotBlank(component.getUpdater())) {
            update.set("updater",component.getUpdater());
        }

        if ( null != component.getCreateTme()) {
            update.set("create_time",component.getCreateTme());
        }

        if (StringUtils.isNotEmpty(component.getType())){
            update.set("type",component.getType());
        }

        if (CollectionUtil.isNotEmpty(component.getProjects())){
            update.set("projects",component.getProjects());
        }
        if (CollectionUtil.isNotEmpty(component.getTags())){
            update.set("tags",component.getTags());
        }
        if (CollectionUtil.isNotEmpty(component.getApplications())){
            update.set("applications",component.getApplications());
        }

        if (StringUtils.isNotBlank(component.getCategory())){
            update.set("category",component.getCategory());
        }
        if (StringUtils.isNotBlank(component.getSubCategory())){
            update.set("sub_category",component.getSubCategory());
        }

        if (StringUtils.isNotBlank(component.getCover())){
            update.set("cover",component.getCover());
        }
        if (StringUtils.isNotBlank(component.getDevelopStatus())){
            update.set("develop_status",component.getDevelopStatus());
        }

        if (StringUtils.isNotBlank(component.getStatus())){
            update.set("status",component.getStatus());
        }

        if (StringUtils.isNotBlank(component.getName())){
            update.set("name",component.getName());
        }
        if (null != component.getIsLib()){
            update.set("is_lib",component.getIsLib());
        }
        if (null != component.getVersions()){
            update.set("versions",component.getVersions());
        }
        if (null != component.getAutomatic_cover()){
            update.set("automatic_cover",component.getAutomatic_cover());
        }
        mongoTemplate.upsert(query, update, Component.class);
    }


    public void update(Component component) {
        ObjectId id = component.getId();
        Query query = new Query(Criteria.where("_id").is(id));
        Update update = new Update();
        update.set("update_time",new Date());
        if (CollectionUtil.isNotEmpty(component.getProjects())){
            update.set("projects",component.getProjects());
        }
        if (CollectionUtil.isNotEmpty(component.getTags())){
            update.set("tags",component.getTags());
        }
        if (CollectionUtil.isNotEmpty(component.getApplications())){
            update.set("applications",component.getApplications());
        }
        if (StringUtils.isNotBlank(component.getCover())){
            update.set("cover",component.getCover());
        }
        if (StringUtils.isNotBlank(component.getDevelopStatus())){
            update.set("develop_status",component.getDevelopStatus());
        }

        if (StringUtils.isNotBlank(component.getStatus())){
            update.set("status",component.getStatus());
        }

        if (StringUtils.isNotBlank(component.getName())){
            update.set("name",component.getName());
        }
        if (null != component.getIsLib()){
            update.set("is_lib",component.getIsLib());
        }
        if (StringUtils.isNotBlank(component.getCategory())){
            update.set("category",component.getCategory());
        }
        if (StringUtils.isNotBlank(component.getSubCategory())){
            update.set("sub_category",component.getSubCategory());
        }
        if (CollectionUtil.isNotEmpty(component.getVersions())){
            update.set("versions",component.getVersions());
        }
        if (StringUtils.isNotBlank(component.getType())){
            update.set("type",component.getType());
        }

        mongoTemplate.updateFirst(query, update, Component.class);
    }

    /**
     * 根据ids批量获取组件信息
     */
    public List<Component> findByIds(Collection<String> ids) {
        if (CollectionUtil.isEmpty(ids)){
            return new ArrayList<>();
        }
        List<ObjectId> objectIds = new ArrayList<>();
        for (String id : ids) {
            objectIds.add(new ObjectId(id));
        }

        Query query = new Query(Criteria.where("_id").in(objectIds).and("status").is("valid"));
        return mongoTemplate.find(query, Component.class);
    }

    public Component findById(String id) {
        Query query = new Query(Criteria.where("_id").is(new ObjectId(id)).and("status").is("valid"));
        return mongoTemplate.findOne(query, Component.class);
    }

    /**
     * 根据name获取组件信息
     */
    public List<Component> findByName(String name) {

        Query query = new Query(Criteria.where("name").is(name).and("status").is("valid"));
        return mongoTemplate.find(query, Component.class);
    }

    public List<Component> findByNames(List<String> names) {
        Query query = new Query(Criteria.where("name").in(names).and("status").is("valid"));
        return mongoTemplate.find(query, Component.class);
    }
    /**
     * 根据name(去掉id)获取组件信息
     */
    public List<Component> findByNameAndId(String name, String id) {
        Query query = new Query(Criteria.where("name").is(name).and("status").is("valid")
                .and("_id").ne(new ObjectId(id)));
        return mongoTemplate.find(query, Component.class);
    }



}
