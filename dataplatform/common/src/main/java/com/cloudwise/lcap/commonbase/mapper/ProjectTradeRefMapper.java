package com.cloudwise.lcap.commonbase.mapper;

import com.cloudwise.lcap.commonbase.entity.ProjectTradeRef;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

/**
 * <p>
 *  Mapper 接口
 * </p>
 *
 * @author ethan.du
 * @since 2022-08-01
 */
public interface ProjectTradeRefMapper extends BaseMapper<ProjectTradeRef> {

    @Select("select * from project_trade_ref where project_id=#{projectId} and deleted=0")
    List<ProjectTradeRef> selectByProjectId(@Param("projectId")String projectId);
}
