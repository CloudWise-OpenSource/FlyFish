package com.cloudwise.lcap.commonbase.mapper;

import com.cloudwise.lcap.commonbase.entity.Component;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;
import org.springframework.stereotype.Repository;

/**
 * <p>
 *  Mapper 接口
 * </p>
 *
 * @author ethan.du
 * @since 2022-08-01
 */
@Repository
public interface ComponentMapper extends BaseMapper<Component> {

    @Update("update component set deleted=0 where id=#{componentId}")
    void revertData(@Param("componentId") String componentId);

    /**
     * 不管是否删除，都查询出来
     * @param componentId
     */
    @Select("select * from  component  where id=#{componentId}")
    Component thisSelectOne(@Param("componentId") String componentId);
}
