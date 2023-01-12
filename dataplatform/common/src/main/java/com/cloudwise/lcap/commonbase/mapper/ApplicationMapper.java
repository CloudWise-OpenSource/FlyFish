package com.cloudwise.lcap.commonbase.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.cloudwise.lcap.commonbase.entity.Application;
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
public interface ApplicationMapper extends BaseMapper<Application> {

    /**
     * @param projectIds projectId list用,拼接并用()包括起来以后的数据结构
     * @return
     */
    List<Application> selectByProjectIds(@Param("projectIds") List<String> projectIds,@Param("accountIds") List<Long> accountIds);


    /**
     * 恢复被删除的大屏
     * @param appId
     * @return
     */
    @Select("update application set deleted=0 where id =#{appId}")
    void revertApplication(@Param("appId") String appId);

    void updateCoverWithId(@Param("appId")String appId,@Param("coverPath") String coverPath);
}
