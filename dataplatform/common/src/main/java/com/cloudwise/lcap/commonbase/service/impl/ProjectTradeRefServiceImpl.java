package com.cloudwise.lcap.commonbase.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.cloudwise.lcap.commonbase.entity.ProjectTradeRef;
import com.cloudwise.lcap.commonbase.mapper.ProjectTradeRefMapper;
import com.cloudwise.lcap.commonbase.service.IProjectTradeRefService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

/**
 * <p>
 *  服务实现类
 * </p>
 *
 * @author ethan.du
 * @since 2022-08-01
 */
@Service
public class ProjectTradeRefServiceImpl extends ServiceImpl<ProjectTradeRefMapper, ProjectTradeRef> implements IProjectTradeRefService {

  @Override
  public List<ProjectTradeRef> getProjectTradeRefsByProjectId(List<String> projectIds){
    LambdaQueryWrapper<ProjectTradeRef> projectTradeRefLQW = new LambdaQueryWrapper<>();
    projectTradeRefLQW.in(!projectIds.isEmpty(),ProjectTradeRef::getProjectId, projectIds);
    return baseMapper.selectList(projectTradeRefLQW);
  }

  @Override
  public List<String> getProjectIdByTradeIds(List<String> tradeIds) {
    LambdaQueryWrapper<ProjectTradeRef> projectTradeRefLQW = new LambdaQueryWrapper<>();
    projectTradeRefLQW.in(ProjectTradeRef::getTradeId,tradeIds);
    return baseMapper.selectList(projectTradeRefLQW).stream().map(ProjectTradeRef::getProjectId).collect(
        Collectors.toList());
  }

  @Override
  public List<String> getTradeIdsByProjectId(String projectId) {
    LambdaQueryWrapper<ProjectTradeRef> tradeRefLambdaQueryWrapper=new LambdaQueryWrapper<>();
    tradeRefLambdaQueryWrapper.eq(ProjectTradeRef::getProjectId,projectId);
    return baseMapper.selectList(tradeRefLambdaQueryWrapper).stream().map(i->i.getTradeId()).collect(
        Collectors.toList());
  }

  @Override
  public void deleteProjectTradeRefByProjectId(String id) {
    LambdaUpdateWrapper<ProjectTradeRef> tradeRefLambdaQueryWrapper=new LambdaUpdateWrapper<>();
    tradeRefLambdaQueryWrapper.eq(ProjectTradeRef::getProjectId,id);
    tradeRefLambdaQueryWrapper.set(ProjectTradeRef::getDeleted,1);
    baseMapper.update(null,tradeRefLambdaQueryWrapper);
  }
}
