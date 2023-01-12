package com.cloudwise.lcap.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.cloudwise.lcap.commonbase.dto.DataTableDto;
import com.cloudwise.lcap.commonbase.entity.DataTable;

import java.util.List;

/**
 * @author yinqiqi
 */
public interface IDataTableService extends IService<DataTable> {
    List<DataTable> getTables(String dataSourceId);

    List<DataTable> getTables(List<String> dataSourceIds);

    DataTableDto addTable(DataTableDto dto);


    void deleteTable(String datasourceId, String tableId);

     void update(DataTableDto dto);
}
