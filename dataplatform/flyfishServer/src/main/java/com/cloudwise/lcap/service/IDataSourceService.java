package com.cloudwise.lcap.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.cloudwise.lcap.commonbase.dto.DataTableDto;
import com.cloudwise.lcap.commonbase.entity.DataSource;

import java.util.Collection;
import java.util.List;

/**
 * <p>
 * 服务类
 * </p>
 *
 * @author luke.miao
 * @since 2022-08-01
 */
public interface IDataSourceService extends IService<DataSource> {

    DataSource findByDatasourceId(String dataSourceId);

    List<DataSource> findByDatasourceIds(Collection<String> dataSourceIds);

    DataSource findByDatasourceName(String dataSourceName);


    DataSource findBySchemaName(String schemaName, String schemaType);

    Page<DataSource> findWithPage(Long pageNo, Long pageSize, String dataSourceName, String schemaName);

    public DataTableDto queryTableMeta(String dataSourceId, String tableName, String schemaName);

    List<DataSource> findByRegexDatasourceName(String dataSourceName);
}
