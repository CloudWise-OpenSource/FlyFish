package com.cloudwise.lcap.commonbase.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.cloudwise.lcap.commonbase.entity.DataSource;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Result;
import org.apache.ibatis.annotations.Results;
import org.apache.ibatis.annotations.Select;

import java.util.List;
import java.util.Set;

/**
 * <p>
 *  Mapper 接口
 * </p>
 *
 * @author luke.miao
 * @since 2022-08-01
 */
public interface DataSourceMapper extends BaseMapper<DataSource> {

    @Select("<script>" +
            "select * from data_source where deleted =0 and id in " +
            " <foreach collection=\"dataSourceIds\" index=\"index\" item=\"id\" separator=\",\" close=\")\" open=\"(\">\n" +
            "            #{id}\n" +
            " </foreach>" +
            "</script>")
    @Results(id = "resultMap", value = {
            @Result(property = "datasourceId", column = "id"),
            @Result(property = "datasourceName", column = "name"),
            @Result(property = "schemaName", column = "schema_name"),
            @Result(property = "schemaType", column = "schema_type"),
            @Result(property = "connectData", column = "connect_data"),
    })
    List<DataSource> getListByIds(@Param("dataSourceIds") Set<String> dataSourceIds);
}
