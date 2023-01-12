package com.cloudwise.lcap.commonbase.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.cloudwise.lcap.commonbase.entity.ComponentProjectRef;
import java.util.List;

import java.util.Collection;

/**
 * <p>
 *  服务类
 * </p>
 *
 * @author luke.miao
 * @since 2022-08-04
 */
public interface IComponentProjectRefService extends IService<ComponentProjectRef> {
  List<String> getComponentIdsByProjectId(String projectId);
  List<String> getComponentIdsByProjectIds(List<String> projectIds);

  List<ComponentProjectRef> getComponentProjectRefByComponentIds(List<String> componentIds);

  void deleteComponentProjectRefByComponentId(String componentId);
  void save(String componentId,List<String> projectId);

     List<ComponentProjectRef> findProjectByComponentId(String componentId);

     List<ComponentProjectRef> findProjectByComponentIds(Collection<String> componentIds);
}
