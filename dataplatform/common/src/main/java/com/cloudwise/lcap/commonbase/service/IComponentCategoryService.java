package com.cloudwise.lcap.commonbase.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.cloudwise.lcap.commonbase.entity.ComponentCategory;
import com.cloudwise.lcap.commonbase.vo.ComponentCategoryAddReqVo;
import com.cloudwise.lcap.commonbase.vo.ComponentCategoryRespVo;

import com.cloudwise.lcap.commonbase.vo.IdRespVo;
import java.util.List;

/**
 * <p>
 * 服务类
 * </p>
 *
 * @author luke.miao
 * @since 2022-08-08
 */
public interface IComponentCategoryService extends IService<ComponentCategory> {
    List<ComponentCategoryRespVo> getCategoryList(String key);

    IdRespVo updateCategory(String id, String name,String icon);

    void deleteCategory(String id);

    IdRespVo addCategory(ComponentCategoryAddReqVo componentCategoryAddReqVo);

}
