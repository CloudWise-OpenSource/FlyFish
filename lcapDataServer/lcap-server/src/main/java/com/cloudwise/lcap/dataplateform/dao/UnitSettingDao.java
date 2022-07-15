package com.cloudwise.lcap.dataplateform.dao;

import cn.hutool.core.collection.CollectionUtil;
import com.cloudwise.lcap.common.PageResult;
import com.cloudwise.lcap.common.utils.Snowflake;
import com.cloudwise.lcap.dataplateform.model.UnitSetting;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Set;

import static com.cloudwise.lcap.common.contants.Constant.SIMPLE;

@Slf4j
@Repository
public class UnitSettingDao {
    @Autowired
    private MongoTemplate mongoTemplate;

    /**
     * 新增可视化组件设置
     */
    public UnitSetting addUnitSetting(UnitSetting unitSetting) {
        unitSetting.setDeleted(0);
        unitSetting.setSettingId(Snowflake.INSTANCE.nextId().toString());
        unitSetting.setCreateTime(new Date());
        unitSetting.setUpdateTime(new Date());
        return mongoTemplate.save(unitSetting);
    }

    public void update(UnitSetting unitSetting) {
        Query query = new Query(Criteria.where("settingId").is(unitSetting.getSettingId()));
        Update update = new Update();
        if (StringUtils.isNotEmpty(unitSetting.getDatasourceId())) {
            update.set("datasourceId", unitSetting.getDatasourceId());
        }
        if (StringUtils.isNotEmpty(unitSetting.getTableId())) {
            update.set("tableId", unitSetting.getTableId());
        }
        if (StringUtils.isNotEmpty(unitSetting.getQueryName())) {
            update.set("queryName", unitSetting.getQueryName());
        }
        if (StringUtils.isNotEmpty(unitSetting.getSql())) {
            update.set("sql", unitSetting.getSql());
        }
        if (null != unitSetting.getSetting()) {
            update.set("setting", unitSetting.getSetting());
        }
        update.set("updateTime", new Date());

        mongoTemplate.upsert(query, update, UnitSetting.class);
    }

    /**
     * 分页查询，页码从0开始
     *
     * @param pageNo
     * @param pageSize
     * @return
     */
    public PageResult<UnitSetting> findAll(Integer pageNo, Integer pageSize, String queryName, Integer queryType, Set<String> datasourceIds) {
        Criteria criteria = Criteria.where("deleted").is(0);
        if (StringUtils.isNotEmpty(queryName)) {
            criteria.and("queryName").regex(queryName, "i");
        }
        if (null != queryType) {
            criteria.and("queryType").is(queryType);
        }
        if (CollectionUtil.isNotEmpty(datasourceIds)) {
            criteria.and("datasourceId").in(datasourceIds);
        }
        Query query = new Query(criteria);
        long total = mongoTemplate.count(query, UnitSetting.class);
        query.with(PageRequest.of(pageNo, pageSize)).with(Sort.by("updateTime").descending());
        List<UnitSetting> unitSettings = mongoTemplate.find(query, UnitSetting.class);
        return new PageResult<>(pageNo, pageSize, total, unitSettings);
    }


    public void deleteById(String settingId) {
        Query query = new Query(Criteria.where("settingId").is(settingId));
        Update update = new Update().set("deleted", 1).set("updateTime", new Date());
        mongoTemplate.upsert(query, update, UnitSetting.class);
    }

    /**
     * 查看该 settingId 是否被复合查询引用
     *
     * @param settingId
     * @return
     */
    public List<UnitSetting> findCombineQueryByRefId(String settingId) {
        Query query = new Query(Criteria.where("queryType").ne(SIMPLE).and("setting.combineIds").in(settingId).and("deleted").is(0));
        return mongoTemplate.find(query, UnitSetting.class);
    }

    /**
     * 查询可视化组件设置 byId
     */
    public UnitSetting findById(String settingId) {
        Query query = new Query(Criteria.where("settingId").is(settingId).and("deleted").is(0));
        return mongoTemplate.findOne(query, UnitSetting.class);
    }

    public List<UnitSetting> findByIds(List<String> settingIds) {
        if (CollectionUtil.isEmpty(settingIds)) {
            return new ArrayList<>();
        }
        Query query = new Query(Criteria.where("settingId").in(settingIds).and("deleted").is(0));
        return mongoTemplate.find(query, UnitSetting.class);
    }

    public UnitSetting findByQueryName(String queryName) {
        Query query = new Query(Criteria.where("queryName").is(queryName).and("deleted").is(0));
        return mongoTemplate.findOne(query, UnitSetting.class);
    }

    public List<UnitSetting> findByDatasourceId(String datasourceId) {
        Query query = new Query(Criteria.where("datasourceId").is(datasourceId).and("deleted").is(0));
        return mongoTemplate.find(query, UnitSetting.class);
    }


}
