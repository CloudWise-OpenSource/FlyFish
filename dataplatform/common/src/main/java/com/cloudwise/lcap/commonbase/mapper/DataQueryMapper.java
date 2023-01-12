package com.cloudwise.lcap.commonbase.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.cloudwise.lcap.commonbase.entity.DataQuery;
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
public interface DataQueryMapper extends BaseMapper<DataQuery> {


    @Select("<script>" +
            "select dq.* from data_query dq left join data_combine_query dcq  on dq.id = dcq.combine_query_id  where dcq.deleted =0 and dq.deleted =0 and dcq.ref_query_id in " +
            " <foreach collection=\"refQueryIds\" index=\"index\" item=\"id\" separator=\",\" close=\")\" open=\"(\">\n" +
            "            #{id}\n" +
            " </foreach>" +
            "</script>")
    @Results(id = "resultMap", value = {
            @Result(property = "id", column = "id"),
            @Result(property = "dataSourceId", column = "data_source_id"),
            @Result(property = "tableId", column = "table_id"),
            @Result(property = "queryName", column = "query_name"),
            @Result(property = "queryType", column = "query_type"),
            @Result(property = "setting", column = "setting"),
            @Result(property = "sql", column = "sql")
    })
    List<DataQuery> getCombineQueryListByRefQueryIds(@Param("refQueryIds") List<String> refQueryIds);

    @Select("<script>" +
            "select * from data_query where deleted =0 and id in " +
            " <foreach collection=\"dataQueryIds\" index=\"index\" item=\"id\" separator=\",\" close=\")\" open=\"(\">\n" +
            "            #{id}\n" +
            " </foreach>" +
            "</script>")
    List<DataQuery> getListByIds(@Param("dataQueryIds") Set<String> dataQueryIds);
}
