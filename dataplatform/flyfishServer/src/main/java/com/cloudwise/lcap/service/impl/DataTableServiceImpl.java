package com.cloudwise.lcap.service.impl;

import cn.hutool.core.collection.CollectionUtil;
import cn.hutool.json.JSONObject;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.UpdateWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.cloudwise.lcap.commonbase.dto.DataTableDto;
import com.cloudwise.lcap.commonbase.entity.DataSource;
import com.cloudwise.lcap.commonbase.entity.DataTable;
import com.cloudwise.lcap.commonbase.exception.ParameterException;
import com.cloudwise.lcap.commonbase.mapper.DataTableMapper;
import com.cloudwise.lcap.commonbase.threadlocal.ThreadLocalContext;
import com.cloudwise.lcap.commonbase.util.Snowflake;
import com.cloudwise.lcap.commonbase.util.ValidatorUtils;
import com.cloudwise.lcap.service.IDataSourceService;
import com.cloudwise.lcap.service.IDataTableService;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;


@Service
@Slf4j
public class DataTableServiceImpl extends ServiceImpl<DataTableMapper, DataTable> implements IDataTableService {

    @Autowired
    private IDataSourceService dataSourceService;

    @Override
    public List<DataTable> getTables(String dataSourceId) {
        LambdaQueryWrapper<DataTable> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(DataTable::getDataSourceId, dataSourceId);
        queryWrapper.eq(DataTable::getDeleted, 0);
        return baseMapper.selectList(queryWrapper);
    }

    @Override
    public List<DataTable> getTables(List<String> dataSourceIds) {
        if (CollectionUtil.isEmpty(dataSourceIds)) {
            return new ArrayList<>();
        }
        LambdaQueryWrapper<DataTable> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.in(DataTable::getDataSourceId, dataSourceIds);
        queryWrapper.eq(DataTable::getDeleted, 0);
        return baseMapper.selectList(queryWrapper);
    }

    @Override
    public void deleteTable(String datasourceId, String tableId) {
        UpdateWrapper<DataTable> updateWrapper = new UpdateWrapper<>();
        updateWrapper.eq("id", tableId);
        updateWrapper.eq("data_source_id", datasourceId);
        updateWrapper.set("deleted", 1);
        updateWrapper.set("updater", ThreadLocalContext.getUserId());
        baseMapper.update(null, updateWrapper);
    }

    @Override
    public DataTableDto addTable(DataTableDto dto) {
        String datasourceId = dto.getDatasourceId();
        DataSource config = dataSourceService.findByDatasourceId(datasourceId);
        if (config == null) {
            log.error("参数错误,数据源不存在");
            throw new ParameterException("数据源信息查询错误,数据源不存在");
        }
        String schemaName = dto.getSchemaName();
        if (StringUtils.isNotBlank(schemaName) && !config.getSchemaName().equals(schemaName)) {
            log.error("参数错误,datasourceId和schemaName不匹配");
            throw new ParameterException("参数错误,数据库id和数据库名称不匹配");
        }
        List<DataTable> tables = getTables(datasourceId);
        String tableName = dto.getTableName();
        if (!ValidatorUtils.varValidate(tableName)) {
            log.error("数据表名不符合规则,schemaName=" + tableName);
            throw new ParameterException("数据表名不符合规则,仅支持数字、英文字母和下划线,并且不能是纯数字");
        }
        if (CollectionUtil.isNotEmpty(tables)) {
            //tableName重名校验
            Optional<DataTable> first = tables.stream().filter(table -> table.getName().equalsIgnoreCase(tableName)).findFirst();
            if (first.isPresent()) {
                log.error("表名称已存在");
                throw new ParameterException("表名称已存在,请重新命名");
            }
        }
        JSONObject tableMeta = dto.getTableMeta();
        tableMeta.put("tableName", tableName);
        tableMeta.put("schemaType", config.getSchemaType());

        DataTableDto.DataTableDtoBuilder dataTableDtoBuilder = DataTableDto.builder().tableId(Snowflake.INSTANCE.nextId().toString()).tableName(tableName).tableMeta(tableMeta);
        DataTable dataTable = DataTable.builder().id(Snowflake.INSTANCE.nextId().toString())
                .name(tableName).meta(tableMeta.toString()).dataSourceId(datasourceId).accountId(ThreadLocalContext.getAccountId())
                .creator(ThreadLocalContext.getUserId()).updater(ThreadLocalContext.getUserId()).deleted(0)
                .build();
        baseMapper.insert(dataTable);

        return dataTableDtoBuilder.build();
    }

    @Override
    public void update(DataTableDto dto) {
        String datasourceId = dto.getDatasourceId();
        String tableId = dto.getTableId();
        String tableName = dto.getTableName();
        //校验库和表都存在
        DataSource config = dataSourceService.findByDatasourceId(datasourceId);
        if (config == null) {
            log.error("参数错误,数据源或数据表不存在");
            throw new ParameterException("参数错误,数据源或数据表不存在");
        }

        if (!ValidatorUtils.varValidate(tableName)) {
            log.error("数据表名不符合规则,schemaName=" + tableName);
            throw new ParameterException("数据表名不符合规则,仅支持数字、英文字母和下划线,并且不能是纯数字");
        }


        List<DataTable> tables = getTables(datasourceId);
        if (CollectionUtil.isNotEmpty(tables)) {
            Optional<DataTable> first = tables.stream().filter(table -> table.getId().equalsIgnoreCase(tableId)).findFirst();
            if (!first.isPresent()) {
                log.error("参数错误,数据表 tableId= " + tableId + " 不存在");
                throw new ParameterException("参数错误,数据表id= " + tableId + " 不存在");
            }
            //tableName重名校验
            Optional<DataTable> first1 = tables.stream().filter(table -> table.getName().equalsIgnoreCase(tableName)).findFirst();
            if (first1.isPresent()) {
                DataTable dataTable = first1.get();
                if (!dataTable.getId().equals(tableId)) {
                    //拥有 tableName 的表是另一个 tableId1，说明表名已被占用
                    log.error("参数错误,数据表名称= " + tableName + " 已存在");
                    throw new ParameterException("参数错误,数据表名称= " + tableName + " 已存在");
                }
            }
        }
        //redis数据表修改时，如果不能根据表结构解析出数据，则报错
        JSONObject tableMeta = dto.getTableMeta();
        DataTable dataTable = new DataTable();
        dataTable.setId(tableId);
        dataTable.setName(tableName);
        dataTable.setMeta(tableMeta.toString());
        baseMapper.updateById(dataTable);
    }


}
