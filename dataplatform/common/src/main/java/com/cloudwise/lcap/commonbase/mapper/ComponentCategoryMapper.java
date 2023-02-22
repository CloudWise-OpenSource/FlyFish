package com.cloudwise.lcap.commonbase.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.cloudwise.lcap.commonbase.entity.ComponentCategory;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.springframework.stereotype.Repository;

/**
 * @author JD
 */
@Mapper
@Repository
public interface ComponentCategoryMapper extends BaseMapper<ComponentCategory> {

    /**
     * 查看第一级分类-未分类
     * @return
     */
    @Select("select * from component_category where parent_id='-1' and name='未分类'")
    ComponentCategory selectFirstDefaultCatalog();

    @Select("select * from component_category where parent_id=#{parentId} and name='未分类'")
    ComponentCategory selectSecondDefaultCatalog(@Param("parentId")String parentId);
}
