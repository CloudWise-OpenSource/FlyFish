package com.cloudwise.lcap.commonbase.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.cloudwise.lcap.commonbase.entity.DataTable;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.springframework.stereotype.Repository;

import java.util.LinkedList;
import java.util.List;

/**
 * @author JD
 */
@Mapper
@Repository
public interface DataTableMapper extends BaseMapper<DataTable> {
    List<DataTable> queryDataSourceAndTable(@Param("dataTableIds") List<String> dataTableIds);

    @Select("<script>" +
            "select * from data_table where deleted =0 and data_source_id in " +
            " <foreach collection=\"dataSourceIds\" index=\"index\" item=\"id\" separator=\",\" close=\")\" open=\"(\">\n" +
            "            #{id}\n" +
            " </foreach>" +
            "</script>")
    List<DataTable> getListByDataSourceIds(@Param("dataSourceIds") List<String> dataSourceIds);
}
