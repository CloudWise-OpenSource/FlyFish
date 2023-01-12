package com.cloudwise.lcap.commonbase.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.cloudwise.lcap.commonbase.entity.ComponentTagRef;
import com.cloudwise.lcap.commonbase.entity.Tag;
import com.cloudwise.lcap.commonbase.mapper.ComponentTagRefMapper;
import com.cloudwise.lcap.commonbase.service.IComponentTagRefService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.cloudwise.lcap.commonbase.service.ITagService;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * <p>
 *  服务实现类
 * </p>
 *
 * @author luke.miao
 * @since 2022-08-04
 */
@Service
public class ComponentTagRefServiceImpl extends ServiceImpl<ComponentTagRefMapper, ComponentTagRef> implements IComponentTagRefService {

  @Autowired
  ITagService iTagService;

  @Override
  public List<String> getComponentIdsByTagIds(List<String> tagIds) {
    LambdaQueryWrapper<ComponentTagRef> lambdaQueryWrapper=new LambdaQueryWrapper();
    lambdaQueryWrapper.in(!tagIds.isEmpty(),ComponentTagRef::getTagId,tagIds);
    return baseMapper.selectList(lambdaQueryWrapper).stream().map(ComponentTagRef::getComponentId).collect(
        Collectors.toList());
  }

  @Override
  public List<String> getComponentIdsByTagName(String name) {
    LambdaQueryWrapper<Tag> tagLambdaQueryWrapper=new LambdaQueryWrapper<>();
    tagLambdaQueryWrapper.like(StringUtils.isNotEmpty(name),Tag::getName,name);
    List<String> tagIds = iTagService.getBaseMapper().selectList(tagLambdaQueryWrapper).stream().map(Tag::getId).collect(Collectors.toList());

    List<String> componentIds = new ArrayList<>();
    LambdaQueryWrapper<ComponentTagRef> lambdaQueryWrapper = new LambdaQueryWrapper();
    if (!tagIds.isEmpty()) {
        lambdaQueryWrapper.in(ComponentTagRef::getTagId, tagIds);
        componentIds = baseMapper.selectList(lambdaQueryWrapper).stream().map(ComponentTagRef::getComponentId).collect(Collectors.toList());
    }

    return componentIds;
  }

  @Override
 public  List<ComponentTagRef> getComponentTagRefsByComponentIds(List<String> ComponentIds) {
    LambdaQueryWrapper<ComponentTagRef> lambdaQueryWrapper=new LambdaQueryWrapper();
    lambdaQueryWrapper.in(ComponentTagRef::getComponentId,ComponentIds);
    return baseMapper.selectList(lambdaQueryWrapper);
  }

  @Override
  public void delComponentTagRefsByComponentId(String componentId) {
    LambdaQueryWrapper<ComponentTagRef> lambdaQueryWrapper=new LambdaQueryWrapper();
    lambdaQueryWrapper.eq(ComponentTagRef::getComponentId,componentId);
    baseMapper.delete(lambdaQueryWrapper);
  }

}
