package com.cloudwise.lcap.commonbase.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.cloudwise.lcap.commonbase.entity.ComponentVersion;
import com.cloudwise.lcap.commonbase.mapper.ComponentVersionMapper;
import com.cloudwise.lcap.commonbase.service.IComponentVersionService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import java.util.List;
import org.springframework.stereotype.Service;

/**
 * <p>
 * 服务实现类
 * </p>
 *
 * @author ethan.du
 * @since 2022-08-01
 */
@Service
public class ComponentVersionServiceImpl extends ServiceImpl<ComponentVersionMapper, ComponentVersion> implements IComponentVersionService {

  @Override
  public List<ComponentVersion> getComponentVersionByComponentIds(List<String> componentIds) {
    LambdaQueryWrapper<ComponentVersion> lambdaQueryWrapper=new LambdaQueryWrapper();
    lambdaQueryWrapper.in(ComponentVersion::getComponentId,componentIds);
    lambdaQueryWrapper.orderByDesc(ComponentVersion::getCreateTime);
    return baseMapper.selectList(lambdaQueryWrapper);
  }
    @Override
    public ComponentVersion getComponentNewestVersion(String componentId) {
        LambdaQueryWrapper<ComponentVersion> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(ComponentVersion::getComponentId, componentId);
        queryWrapper.eq(ComponentVersion::getDeleted, 0);
        queryWrapper.orderByDesc(ComponentVersion::getCreateTime);
        return baseMapper.selectOne(queryWrapper);
    }

    @Override
    public ComponentVersion getComponentVersion(String componentId, String no) {
        LambdaQueryWrapper<ComponentVersion> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(ComponentVersion::getComponentId, componentId);
        queryWrapper.eq(ComponentVersion::getNo, no);
        queryWrapper.eq(ComponentVersion::getDeleted, 0);
        return baseMapper.selectOne(queryWrapper);
    }

    @Override
    public List<ComponentVersion> getComponentVersions(String componentId) {
        LambdaQueryWrapper<ComponentVersion> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(ComponentVersion::getComponentId, componentId);
        queryWrapper.eq(ComponentVersion::getDeleted, 0);
        return baseMapper.selectList(queryWrapper);
    }
}
