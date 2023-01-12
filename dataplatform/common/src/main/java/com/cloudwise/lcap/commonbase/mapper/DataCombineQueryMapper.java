package com.cloudwise.lcap.commonbase.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.cloudwise.lcap.commonbase.entity.DataCombineQuery;
import com.cloudwise.lcap.commonbase.entity.DataQuery;
import org.apache.ibatis.annotations.*;

import java.util.List;

/**
 * <p>
 *  Mapper 接口
 * </p>
 *
 * @author luke.miao
 * @since 2022-08-01
 */
public interface DataCombineQueryMapper extends BaseMapper<DataCombineQuery> {

    /**
     * 通过基础查询id删除基础查询的引用关系
     * @param refQueryId
     * @return
     */
    @Update("update data_combine_query set deleted=1 where ref_query_id=#{refQueryId}")
    int deleteByRefQueryId(@Param("refQueryId")String refQueryId);

    @Select("<script>" +
            "select * from data_combine_query where deleted =0 and combine_query_id in " +
            " <foreach collection=\"combineIds\" index=\"index\" item=\"id\" separator=\",\" close=\")\" open=\"(\">\n" +
            "            #{id}\n" +
            " </foreach>" +
            "</script>")
    List<DataCombineQuery> getListByCombineQueryIds(@Param("combineIds") List<String> combineIds);

    /**
     * 通过关联查询id删除基础查询的引用关系
     * @param combineQueryId
     * @return
     */
    @Update("update data_combine_query set deleted=1 where combine_query_id=#{combineQueryId}")
    int deleteByCombineQueryId(@Param("combineQueryId") String combineQueryId);

    /**
     * 根据id删除记录
     * @param id
     */
    @Update("update data_combine_query set deleted=1 where id=#{id}")
    void removeById(@Param("id") String id);
}
