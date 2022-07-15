package com.cloudwise.lcap.dataplateform.dao;

import cn.hutool.core.collection.CollectionUtil;
import com.cloudwise.lcap.common.PageResult;
import com.cloudwise.lcap.common.utils.Snowflake;
import com.cloudwise.lcap.dataplateform.model.DataSourceConfig;
import com.cloudwise.lcap.dataplateform.model.DataTable;
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

import java.util.Date;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;


@Slf4j
@Repository
public class DataSourceDao {
    @Autowired
    private MongoTemplate mongoTemplate;

    /**
     * 保存数据源
     */
    public DataSourceConfig save(DataSourceConfig sourceConfig) {
        sourceConfig.setDatasourceId(Snowflake.INSTANCE.nextId().toString());
        sourceConfig.setDeleted(0);
        sourceConfig.setCreateTime(new Date());
        sourceConfig.setUpdateTime(new Date());
        return mongoTemplate.save(sourceConfig);
    }


    /**
     * 查询数据源
     */
    public DataSourceConfig findBySchemaName(String schemaName) {
        Criteria criteriaDefinition = Criteria.where("schemaName").is(schemaName)
                .and("deleted").is(0);
        Query query = new Query(criteriaDefinition);
        return mongoTemplate.findOne(query, DataSourceConfig.class);
    }

    public DataSourceConfig findByDatasourceName(String datasourceName) {
        Criteria criteriaDefinition = Criteria.where("datasourceName").is(datasourceName)
                .and("deleted").is(0);
        Query query = new Query(criteriaDefinition);
        return mongoTemplate.findOne(query, DataSourceConfig.class);
    }

    public List<DataSourceConfig> findByRegexDatasourceName(String datasourceName) {
        Criteria criteriaDefinition = Criteria.where("datasourceName").regex(datasourceName, "i").and("deleted").is(0);
        Query query = new Query(criteriaDefinition);
        return mongoTemplate.find(query, DataSourceConfig.class);
    }

    public DataSourceConfig findByDatasourceId(String datasourceId) {
        Query query = new Query(Criteria.where("datasourceId").is(datasourceId).and("deleted").is(0));
        return mongoTemplate.findOne(query, DataSourceConfig.class);
    }

    public List<DataSourceConfig> findByDatasourceIds(Set<String> datasourceIds) {
        Query query = new Query(Criteria.where("datasourceId").in(datasourceIds).and("deleted").is(0));
        return mongoTemplate.find(query, DataSourceConfig.class);
    }


    public DataSourceConfig findByDatasourceIdAndTableId(String datasourceId, String tableId) {
        Query query = new Query(Criteria.where("datasourceId").is(datasourceId).and("deleted").is(0)
                .and("tables.tableId").is(tableId));
        return mongoTemplate.findOne(query, DataSourceConfig.class);
    }


    public PageResult<DataSourceConfig> findDataSource(Integer pageNo, Integer pageSize, String datasourceName, String schemaName) {
        Criteria criteria = Criteria.where("deleted").is(0);
        if (StringUtils.isNotEmpty(datasourceName)) {
            criteria.and("datasourceName").regex(datasourceName, "i");
        }
        if (StringUtils.isNotEmpty(schemaName)) {
            criteria.and("schemaName").regex(schemaName, "i");
        }
        Query query = new Query(criteria);
        long total = mongoTemplate.count(query, DataSourceConfig.class);

        query.with(PageRequest.of(pageNo, pageSize)).with(Sort.by("updateTime").descending());
        List<DataSourceConfig> dataSourceConfigs = mongoTemplate.find(query, DataSourceConfig.class);
        return new PageResult<>(pageNo, pageSize, total, dataSourceConfigs);
    }


    public void update(DataSourceConfig config) {
        Query query = new Query(Criteria.where("datasourceId").is(config.getDatasourceId()));

        Update update = new Update();
        if (StringUtils.isNotEmpty(config.getSchemaType())) {
            update.set("schemaType", config.getSchemaType());
        }
        if (StringUtils.isNotEmpty(config.getDatasourceName())) {
            update.set("datasourceName", config.getDatasourceName());
        }
        if (StringUtils.isNotEmpty(config.getSchemaName())) {
            update.set("schemaName", config.getSchemaName());
        }
        if (StringUtils.isNotEmpty(config.getConnectData())) {
            update.set("connectData", config.getConnectData());
        }
        update.set("updateTime", new Date());

        mongoTemplate.upsert(query, update, DataSourceConfig.class);
    }


    /**
     * 删除数据源
     */
    public void deleteByDatasourceId(String datasourceId) {
        Query query = new Query(Criteria.where("datasourceId").is(datasourceId));
        Update update = new Update().set("deleted", 1).set("updateTime", new Date());

        mongoTemplate.upsert(query, update, DataSourceConfig.class);
    }

    /**
     * 增加数据表
     *
     * @return
     */
    public void addTable(DataTable dataTable, String datasourceId) {
        Query query = new Query(Criteria.where("datasourceId").is(datasourceId));
        Update update = new Update().addToSet("tables", dataTable).set("updateTime", new Date());
        ;
        mongoTemplate.upsert(query, update, DataSourceConfig.class);
    }

    /**
     * 修改数据表
     *
     * @param dataTable
     */
    public void updateTable(DataTable dataTable, String datasourceId) {
        Update update = new Update();
        update.set("updateTime", new Date());
        boolean isUpdate = false;
        if (StringUtils.isNotEmpty(dataTable.getTableName())) {
            update.set("tables.$.tableName", dataTable.getTableName());
            isUpdate = true;
        }

        if (CollectionUtil.isNotEmpty(dataTable.getTableMeta())) {
            update.set("tables.$.tableMeta", dataTable.getTableMeta());
            isUpdate = true;
        }

        if (isUpdate) {
            Query query = new Query(Criteria.where("datasourceId").is(datasourceId)
                    .and("tables.tableId").is(dataTable.getTableId()));
            mongoTemplate.upsert(query, update, DataSourceConfig.class);
        }
    }


    /**
     * 删除数据表
     */
    public DataSourceConfig deleteTableByTableId(String tableId, String datasourceId) {
        Query query = new Query(Criteria.where("datasourceId").is(datasourceId));
        DataSourceConfig config = mongoTemplate.findOne(query, DataSourceConfig.class);
        if (null != config) {
            List<DataTable> tables = config.getTables();
            if (CollectionUtil.isNotEmpty(tables)) {
                List<DataTable> collect = tables.stream().filter(table -> !table.getTableId().equals(tableId)).collect(Collectors.toList());
                Update update = new Update().set("tables", collect);
                mongoTemplate.updateFirst(query, update, DataSourceConfig.class);
                config.setTables(collect);
            }
        }
        return config;
    }

}
