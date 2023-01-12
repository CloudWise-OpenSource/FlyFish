package com.cloudwise.lcap.commonbase.mapper;

import com.cloudwise.lcap.commonbase.entity.Project;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * <p>
 *  Mapper 接口
 * </p>
 *
 * @author ethan.du
 * @since 2022-08-01
 */
@Repository
public interface ProjectMapper extends BaseMapper<Project> {

    List<Project> projectList(@Param("accountIds") List<Long> accountIds);


    @Select("select * from project where deleted=0 and name =#{projectName}")
    List<Project> selectByName(@Param("projectName") String projectName);


    @Select("select * from project where id =#{projectId}")
    Project selectByProjectId(@Param("projectId") String projectId);


    /**
     * 恢复被删除的项目
     * @param projectId
     * @return
     */
    @Select("update project set deleted=0 where id =#{projectId}")
    void revertProject(@Param("projectId") String projectId);
}
