package com.cloudwise.lcap.service.impl;

import cn.hutool.core.collection.CollectionUtil;
import cn.hutool.json.JSONObject;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.cloudwise.lcap.commonbase.dto.DataTableDto;
import com.cloudwise.lcap.commonbase.entity.DataSource;
import com.cloudwise.lcap.commonbase.entity.DataTable;
import com.cloudwise.lcap.commonbase.exception.ParameterException;
import com.cloudwise.lcap.commonbase.mapper.DataSourceMapper;
import com.cloudwise.lcap.commonbase.threadlocal.ThreadLocalContext;
import com.cloudwise.lcap.datasource.query.JDBCQueryProxy;
import com.cloudwise.lcap.service.IDataSourceService;
import com.cloudwise.lcap.service.IDataTableService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

import static com.cloudwise.lcap.commonbase.contants.Constant.*;

/**
 * <p>
 * 服务实现类
 * </p>
 *
 * @author luke.miao
 * @since 2022-08-01
 */
@Service
public class DataSourceServiceImpl extends ServiceImpl<DataSourceMapper, DataSource> implements IDataSourceService {

    @Autowired
    IDataTableService dataTableService;

    @Value("${datasource.maxconnect}")
    private int maxConnect;

    @Override
    public DataSource findByDatasourceId(String dataSourceId) {
        LambdaQueryWrapper<DataSource> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(DataSource::getDatasourceId, dataSourceId);
        queryWrapper.eq(DataSource::getDeleted, 0);
        return baseMapper.selectOne(queryWrapper);
    }

    @Override
    public List<DataSource> findByDatasourceIds(Collection<String> dataSourceIds) {
        if (CollectionUtil.isEmpty(dataSourceIds)) {
            return new ArrayList<>();
        }
        LambdaQueryWrapper<DataSource> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.in(DataSource::getDatasourceId, dataSourceIds);
        queryWrapper.eq(DataSource::getDeleted, 0);
        return baseMapper.selectList(queryWrapper);
    }

    @Override
    public DataSource findByDatasourceName(String dataSourceName) {
        LambdaQueryWrapper<DataSource> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(DataSource::getDatasourceName, dataSourceName);
        queryWrapper.eq(DataSource::getAccountId, ThreadLocalContext.getAccountId());
        queryWrapper.eq(DataSource::getDeleted, 0);
        return baseMapper.selectOne(queryWrapper);
    }

    @Override
    public DataSource findBySchemaName(String schemaName, String schemaType) {
        LambdaQueryWrapper<DataSource> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(DataSource::getSchemaName, schemaName);
        if (StringUtils.isNotBlank(schemaType)) {
            queryWrapper.eq(DataSource::getSchemaType, schemaType);
        }
        queryWrapper.eq(DataSource::getAccountId, ThreadLocalContext.getAccountId());
        queryWrapper.eq(DataSource::getDeleted, 0);
        return baseMapper.selectOne(queryWrapper);
    }

    @Override
    public Page<DataSource> findWithPage(Long pageNo, Long pageSize, String dataSourceName, String schemaName) {
        LambdaQueryWrapper<DataSource> queryWrapper = new LambdaQueryWrapper<>();
        if (StringUtils.isNotBlank(schemaName)) {
            queryWrapper.like(DataSource::getSchemaName, schemaName);
        }
        if (StringUtils.isNotBlank(dataSourceName)) {
            queryWrapper.like(DataSource::getDatasourceName, dataSourceName);
        }
        queryWrapper.eq(DataSource::getDeleted, 0);
        List<Long> accountIds = new ArrayList<>();
        accountIds.add(ThreadLocalContext.getAccountId());
        accountIds.add(-1L);

        queryWrapper.in(DataSource::getAccountId, accountIds);
        queryWrapper.orderByDesc(DataSource::getUpdateTime);
        Page<DataSource> page = baseMapper.selectPage(new Page<>(pageNo, pageSize), queryWrapper);
        return page;
    }

    @Override
    public DataTableDto queryTableMeta(String dataSourceId, String tableName, String schemaName) {
        DataSource dataSource = findByDatasourceId(dataSourceId);
        if (null == dataSource) {
            log.error("参数错误，数据源不存在");
            throw new ParameterException("参数错误，数据源不存在");
        }
        String schemaType = dataSource.getSchemaType();
        DataTableDto dataTableDto = DataTableDto.builder().datasourceId(dataSource.getDatasourceId()).datasourceName(dataSource.getDatasourceName()).schemaName(schemaName)
                .schemaType(schemaType).tableId(tableName).build();

        switch (schemaType.toLowerCase()) {
            case MYSQL:
            case POSTGRES:
            case SQL_SERVER:
            case ORACLE:
            case DAMENG:
            case MARIA:
            case CLICKHOUSE:
                return JDBCQueryProxy.getTableDetail(dataSource, tableName, dataTableDto, maxConnect, schemaType);
            case HTTP:
                List<DataTable> tables = dataTableService.getTables(dataSourceId);
                if (CollectionUtil.isNotEmpty(tables)) {
                    Optional<DataTable> first = tables.stream().filter(table -> table.getName().equalsIgnoreCase(tableName)).findFirst();
                    if (first.isPresent()) {
                        DataTable dataTable = first.get();
                        JSONObject tableMeta = new JSONObject(dataTable.getMeta());
                        dataTableDto.setTableMeta(tableMeta);
                        dataTableDto.setTableId(dataTable.getId());
                        dataTableDto.setTableName(dataTable.getName());
                        if (null != tableMeta && tableMeta.containsKey("fields")) {
                            Object fields = tableMeta.get("fields");
                            dataTableDto.setFields(fields);
                        }
                    }
                }
                //http不需要样例数据
                return dataTableDto;
            default:
                break;
        }
        return dataTableDto;
    }


    @Override
    public List<DataSource> findByRegexDatasourceName(String dataSourceName) {
        LambdaQueryWrapper<DataSource> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.like(DataSource::getDatasourceName, dataSourceName);
        queryWrapper.eq(DataSource::getDeleted, 0);
        List<Long> accountIds = new ArrayList<>();
        accountIds.add(ThreadLocalContext.getAccountId());
        accountIds.add(-1L);

        queryWrapper.in(DataSource::getAccountId, accountIds);
        return baseMapper.selectList(queryWrapper);
    }

}
