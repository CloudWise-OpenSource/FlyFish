package com.cloudwise.lcap.dataplateform.service;

import cn.hutool.core.collection.CollectionUtil;
import cn.hutool.json.JSONObject;
import com.cloudwise.lcap.common.exception.ParameterException;
import com.cloudwise.lcap.common.utils.Snowflake;
import com.cloudwise.lcap.common.utils.ValidatorUtils;
import com.cloudwise.lcap.dataplateform.dao.DataSourceDao;
import com.cloudwise.lcap.dataplateform.dto.DataTableDto;
import com.cloudwise.lcap.dataplateform.model.DataSourceConfig;
import com.cloudwise.lcap.dataplateform.model.DataTable;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@Slf4j
public class DataTableService {

    @Autowired
    private DataSourceDao dataSourceDao;

    public DataTableDto addTable(DataTableDto dto) {
        String datasourceId = dto.getDatasourceId();
        DataSourceConfig config = dataSourceDao.findByDatasourceId(datasourceId);
        if (config == null) {
            log.error("参数错误,数据源不存在");
            throw new ParameterException("数据源信息查询错误,数据源不存在");
        }
        String schemaName = dto.getSchemaName();
        if (StringUtils.isNotBlank(schemaName) && !config.getSchemaName().equals(schemaName)) {
            log.error("参数错误,datasourceId和schemaName不匹配");
            throw new ParameterException("参数错误,数据库id和数据库名称不匹配");
        }
        List<DataTable> tables = config.getTables();
        String tableName = dto.getTableName();
        if (!ValidatorUtils.varValidate(tableName)) {
            log.error("数据表名不符合规则,schemaName=" + tableName);
            throw new ParameterException("数据表名不符合规则,仅支持数字、英文字母和下划线,并且不能是纯数字");
        }
        if (CollectionUtil.isNotEmpty(tables)) {
            //tableName重名校验
            Optional<DataTable> first = tables.stream().filter(table -> table.getTableName().equalsIgnoreCase(tableName)).findFirst();
            if (first.isPresent()) {
                log.error("表名称已存在");
                throw new ParameterException("表名称已存在,请重新命名");
            }
        }
        JSONObject tableMeta = dto.getTableMeta();
        tableMeta.put("tableName", tableName);
        tableMeta.put("schemaType", config.getSchemaType());

        DataTableDto.DataTableDtoBuilder dataTableDtoBuilder = DataTableDto.builder().tableId(Snowflake.INSTANCE.nextId().toString()).tableName(tableName).tableMeta(tableMeta);
        DataTable dataTable = DataTable.builder().tableId(Snowflake.INSTANCE.nextId().toString()).tableName(tableName).tableMeta(tableMeta).build();
        dataSourceDao.addTable(dataTable, datasourceId);

        return dataTableDtoBuilder.build();
    }

    public void update(DataTableDto dto) {
        String datasourceId = dto.getDatasourceId();
        String tableId = dto.getTableId();
        String tableName = dto.getTableName();
        //校验库和表都存在
        DataSourceConfig config = dataSourceDao.findByDatasourceIdAndTableId(datasourceId, tableId);
        if (config == null) {
            log.error("参数错误,数据源或数据表不存在");
            throw new ParameterException("参数错误,数据源或数据表不存在");
        }

        if (!ValidatorUtils.varValidate(tableName)) {
            log.error("数据表名不符合规则,schemaName=" + tableName);
            throw new ParameterException("数据表名不符合规则,仅支持数字、英文字母和下划线,并且不能是纯数字");
        }


        List<DataTable> tables = config.getTables();
        if (CollectionUtil.isNotEmpty(tables)) {
            Optional<DataTable> first = tables.stream().filter(table -> table.getTableId().equalsIgnoreCase(tableId)).findFirst();
            if (!first.isPresent()) {
                log.error("参数错误,数据表 tableId= " + tableId + " 不存在");
                throw new ParameterException("参数错误,数据表id= " + tableId + " 不存在");
            }
            //tableName重名校验
            Optional<DataTable> first1 = tables.stream().filter(table -> table.getTableName().equalsIgnoreCase(tableName)).findFirst();
            if (first1.isPresent()) {
                DataTable dataTable = first1.get();
                if (!dataTable.getTableId().equals(tableId)) {
                    //拥有 tableName 的表是另一个 tableId1，说明表名已被占用
                    log.error("参数错误,数据表名称= " + tableName + " 已存在");
                    throw new ParameterException("参数错误,数据表名称= " + tableName + " 已存在");
                }
            }
        }
        //redis数据表修改时，如果不能根据表结构解析出数据，则报错
        JSONObject tableMeta = dto.getTableMeta();
        DataTable dataTable = new DataTable();
        dataTable.setTableId(tableId);
        dataTable.setTableName(tableName);
        dataTable.setTableMeta(tableMeta);
        dataSourceDao.updateTable(dataTable, datasourceId);
    }


}
