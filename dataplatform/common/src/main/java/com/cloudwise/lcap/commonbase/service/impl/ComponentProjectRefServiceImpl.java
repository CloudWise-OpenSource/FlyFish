package com.cloudwise.lcap.commonbase.service.impl;

import cn.hutool.core.collection.CollectionUtil;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.cloudwise.lcap.commonbase.entity.ComponentProjectRef;
import com.cloudwise.lcap.commonbase.mapper.ComponentProjectRefMapper;
import com.cloudwise.lcap.commonbase.service.IComponentProjectRefService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

import java.util.Collection;

/**
 * <p>
 *  服务实现类
 * </p>
 *
 * @author luke.miao
 * @since 2022-08-04
 */
@Service
public class ComponentProjectRefServiceImpl extends ServiceImpl<ComponentProjectRefMapper, ComponentProjectRef> implements IComponentProjectRefService {

    @Override
    public List<ComponentProjectRef> findProjectByComponentId(String componentId){
        LambdaQueryWrapper<ComponentProjectRef> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(ComponentProjectRef::getComponentId,componentId);
        queryWrapper.eq(ComponentProjectRef::getDeleted,0);
        return baseMapper.selectList(queryWrapper);
    }

    @Override
    public List<ComponentProjectRef> findProjectByComponentIds(Collection<String> componentIds){
        if (CollectionUtil.isEmpty(componentIds)){
            return new ArrayList<>();
        }
        LambdaQueryWrapper<ComponentProjectRef> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.in(ComponentProjectRef::getComponentId,componentIds);
        queryWrapper.eq(ComponentProjectRef::getDeleted,0);
        return baseMapper.selectList(queryWrapper);
    }
  @Override
  public List<String> getComponentIdsByProjectId(String projectId) {
    LambdaQueryWrapper<ComponentProjectRef> lambdaQueryWrapper=new LambdaQueryWrapper();
    lambdaQueryWrapper.eq(ComponentProjectRef::getProjectId,projectId);
   return baseMapper.selectList(lambdaQueryWrapper).stream().map(i->i.getComponentId()).collect(Collectors.toList());
  }

  @Override
  public List<String> getComponentIdsByProjectIds(List<String> projectIds) {
    LambdaQueryWrapper<ComponentProjectRef> lambdaQueryWrapper=new LambdaQueryWrapper();
    lambdaQueryWrapper.in(ComponentProjectRef::getProjectId,projectIds);
    return baseMapper.selectList(lambdaQueryWrapper).stream().map(i->i.getComponentId()).collect(Collectors.toList());
  }

  @Override
  public List<ComponentProjectRef> getComponentProjectRefByComponentIds(List<String> componentIds) {
    LambdaQueryWrapper<ComponentProjectRef> lambdaQueryWrapper=new LambdaQueryWrapper();
    lambdaQueryWrapper.in(ComponentProjectRef::getComponentId,componentIds);
    return baseMapper.selectList(lambdaQueryWrapper);
  }

  @Override
  public void deleteComponentProjectRefByComponentId(String componentId) {
    LambdaQueryWrapper<ComponentProjectRef> lambdaQueryWrapper=new LambdaQueryWrapper();
    lambdaQueryWrapper.eq(ComponentProjectRef::getComponentId,componentId);
    baseMapper.delete(lambdaQueryWrapper);
  }

  @Override
  public void save(String componentId, List<String> projectIds) {
    List<ComponentProjectRef> componentProjectRefList=new ArrayList<>();
    projectIds.forEach(projectId->{
      ComponentProjectRef componentProjectRef=new ComponentProjectRef();
      componentProjectRef.setComponentId(componentId);
      componentProjectRef.setProjectId(projectId);
      componentProjectRefList.add(componentProjectRef);
    });
    saveBatch(componentProjectRefList);
  }
}
