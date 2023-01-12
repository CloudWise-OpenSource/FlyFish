package com.cloudwise.lcap.commonbase.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.cloudwise.lcap.commonbase.contants.Constant;
import com.cloudwise.lcap.commonbase.entity.Component;
import com.cloudwise.lcap.commonbase.entity.ComponentCategory;
import com.cloudwise.lcap.commonbase.enums.InitFrom;
import com.cloudwise.lcap.commonbase.enums.ResultCode;
import com.cloudwise.lcap.commonbase.exception.BaseException;
import com.cloudwise.lcap.commonbase.mapper.ComponentCategoryMapper;
import com.cloudwise.lcap.commonbase.mapstruct.StructUtil;
import com.cloudwise.lcap.commonbase.threadlocal.ThreadLocalContext;
import com.cloudwise.lcap.commonbase.util.ResourceUtil;
import com.cloudwise.lcap.commonbase.service.IComponentCategoryService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.cloudwise.lcap.commonbase.service.IComponentService;
import com.cloudwise.lcap.commonbase.vo.ComponentCategoryAddReqVo;
import com.cloudwise.lcap.commonbase.vo.ComponentCategoryRespVo;
import com.cloudwise.lcap.commonbase.vo.IdRespVo;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * <p>
 * 服务实现类
 * </p>
 *
 * @author luke.miao
 * @since 2022-08-08
 */
@Service
public class ComponentCategoryServiceImpl extends
    ServiceImpl<ComponentCategoryMapper, ComponentCategory> implements IComponentCategoryService {

  @Autowired
  IComponentService iComponentService;

  @Autowired
  ResourceUtil resourceUtil;

  @Autowired
  StructUtil structUtil;

  @Override
  public List<ComponentCategoryRespVo> getCategoryList(String key) {
    Long accountId = ThreadLocalContext.getAccountId();

    LambdaQueryWrapper<ComponentCategory> categoryLambdaQueryWrapper = new LambdaQueryWrapper<>();
    categoryLambdaQueryWrapper
        .in(ComponentCategory::getAccountId, Arrays.asList(accountId, Constant.INNER_ACCOUNT_ID))
        .like(StringUtils.isNotEmpty(key), ComponentCategory::getName, key)
        .orderByDesc(ComponentCategory::getCreateTime);
    List<ComponentCategory> componentCategories = baseMapper.selectList(categoryLambdaQueryWrapper);

    List<ComponentCategory> componentCategoriesParent = componentCategories.stream()
        .filter(i -> StringUtils.isNotEmpty(i.getParentId()) && i.getParentId()
            .equals(Constant.INNER_ACCOUNT_ID.toString()))
        .collect(Collectors.toList());
    List<ComponentCategoryRespVo> componentCategoryRespVos = structUtil
        .convertComponentCategoryRespVo(componentCategoriesParent);

    componentCategories.removeAll(componentCategoriesParent);
    componentCategoryRespVos.forEach(componentCategoryRespVo -> {
      componentCategories.forEach(componentCategorySub -> {
        if (componentCategorySub.getParentId() != null && componentCategorySub.getParentId()
            .equals(componentCategoryRespVo.getId())) {
          if (componentCategoryRespVo.getChildren() == null) {
            componentCategoryRespVo.setChildren(new ArrayList<>());
          }
          componentCategoryRespVo.getChildren()
              .add(structUtil.convertComponentCategorySubRespVo(componentCategorySub));

          // 冗余字段
          if (componentCategoryRespVo.getSubCategories() == null) {
            componentCategoryRespVo.setSubCategories(new ArrayList<>());
          }
          componentCategoryRespVo.getSubCategories()
                  .add(structUtil.convertComponentCategorySubRespVo(componentCategorySub));
        }
      });
      if (componentCategoryRespVo.getChildren() == null) {
        componentCategoryRespVo.setChildren(new ArrayList<>());
      }

      // 冗余字段
      if (componentCategoryRespVo.getSubCategories() == null) {
        componentCategoryRespVo.setSubCategories(new ArrayList<>());
      }
    });
    return componentCategoryRespVos;
  }

  @Override
  public IdRespVo updateCategory(String id, String name,String icon) {
    Long accountId = ThreadLocalContext.getAccountId();
    ComponentCategory componentCategory = checkAuth(id);

    LambdaQueryWrapper<ComponentCategory> lambdaQueryWrapper = new LambdaQueryWrapper();
    lambdaQueryWrapper.eq(ComponentCategory::getName, name)
        .in(ComponentCategory::getAccountId, Arrays.asList(accountId, Constant.INNER_ACCOUNT_ID));
    lambdaQueryWrapper.eq(ComponentCategory::getParentId,componentCategory.getParentId());
    lambdaQueryWrapper.ne(ComponentCategory::getId,id);
    Long selectCount = baseMapper.selectCount(lambdaQueryWrapper);
    if (selectCount>0) {
      throw new BaseException(ResultCode.ALREADY_EXISTS.getCode(),
          ResultCode.ALREADY_EXISTS.getMsg());
    }

    componentCategory.setName(name);
    if (StringUtils.isNotBlank(icon)){
      componentCategory.setIcon(icon);
    }
    baseMapper.updateById(componentCategory);
    return new IdRespVo(id);
  }


  private ComponentCategory checkAuth(String id) {
    ComponentCategory componentCategory = ResourceUtil.checkResource(baseMapper, id);
    if (Objects.equals(componentCategory.getAccountId(), Constant.INNER_ACCOUNT_ID)
        || (componentCategory.getInitFrom() != null && componentCategory.getInitFrom()
        .equals(InitFrom.DOMA
            .getType()))) {
      throw new BaseException(ResultCode.NO_AUTH.getCode(),
          ResultCode.NO_AUTH.getMsg());
    }
    return componentCategory;
  }


  @Override
  public void deleteCategory(String id) {
    checkAuth(id);
    //判断是否有子组件
    LambdaQueryWrapper<ComponentCategory> lambdaQueryWrapper = new LambdaQueryWrapper<>();
    lambdaQueryWrapper.eq(ComponentCategory::getParentId, id);
    ComponentCategory componentCategory = baseMapper.selectOne(lambdaQueryWrapper);
    if (componentCategory != null) {
      throw new BaseException(ResultCode.EXISTS_ALREADY_COMPONENT_CATEGORY.getCode(),
          ResultCode.EXISTS_ALREADY_COMPONENT_CATEGORY.getMsg());
    }
    //判断是否有组件
    LambdaQueryWrapper<Component> componentLambdaQueryWrapper = new LambdaQueryWrapper<>();
    componentLambdaQueryWrapper.eq(Component::getSubCategoryId, id);
    Component component = iComponentService.getOne(componentLambdaQueryWrapper);
    if (component != null) {
      throw new BaseException(ResultCode.EXISTS_ALREADY_COMPONENT_IN_CATEGORY.getCode(),
          ResultCode.EXISTS_ALREADY_COMPONENT_IN_CATEGORY.getMsg());
    }
    baseMapper.deleteById(id);
  }

  @Override
  public IdRespVo addCategory(ComponentCategoryAddReqVo componentCategoryAddReqVo) {
    Long accountId = ThreadLocalContext.getAccountId();

    LambdaQueryWrapper<ComponentCategory> lambdaQueryWrapper = new LambdaQueryWrapper();
    lambdaQueryWrapper.eq(ComponentCategory::getName, componentCategoryAddReqVo.getName())
        .in(ComponentCategory::getAccountId, Arrays.asList(accountId, Constant.INNER_ACCOUNT_ID));
    if(StringUtils.isEmpty(componentCategoryAddReqVo.getParentId())){
      lambdaQueryWrapper.eq(ComponentCategory::getParentId,Constant.COMPONENT_CATEGORY_PARENT_ID);
    }else{
      lambdaQueryWrapper.eq(ComponentCategory::getParentId,componentCategoryAddReqVo.getParentId());
    }
    ComponentCategory componentCategory = baseMapper.selectOne(lambdaQueryWrapper);
    if (componentCategory != null) {
      throw new BaseException(ResultCode.ALREADY_EXISTS.getCode(),
          ResultCode.ALREADY_EXISTS.getMsg());
    }

    ComponentCategory category = new ComponentCategory();
    category.setName(componentCategoryAddReqVo.getName());
    category.setIcon(componentCategoryAddReqVo.getIcon());
    if (StringUtils.isNotEmpty(componentCategoryAddReqVo.getParentId())) {
      //根据检查父id检查是否存在
      LambdaQueryWrapper<ComponentCategory> lambdaQueryWrapperParent= new LambdaQueryWrapper();
      lambdaQueryWrapperParent.eq(ComponentCategory::getId,componentCategoryAddReqVo.getParentId())
      .in(ComponentCategory::getAccountId, Arrays.asList(accountId, Constant.INNER_ACCOUNT_ID));
      ComponentCategory parentComponentCategory = baseMapper.selectOne(lambdaQueryWrapperParent);
      if (parentComponentCategory == null) {
        throw new BaseException(ResultCode.PARENT_COMPONENT_NOT_EXISTS.getCode(),
            ResultCode.PARENT_COMPONENT_NOT_EXISTS.getMsg());
      }

      ResourceUtil.checkResource(baseMapper, componentCategoryAddReqVo.getParentId());
      category.setParentId(componentCategoryAddReqVo.getParentId());

    } else {
      category.setParentId(Constant.INNER_ACCOUNT_ID.toString());
    }
    baseMapper.insert(category);
    return new IdRespVo(category.getId());
  }
}
