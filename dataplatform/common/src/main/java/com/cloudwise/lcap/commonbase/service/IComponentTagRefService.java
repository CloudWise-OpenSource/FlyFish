package com.cloudwise.lcap.commonbase.service;

import com.cloudwise.lcap.commonbase.entity.ComponentTagRef;
import com.baomidou.mybatisplus.extension.service.IService;
import java.util.List;

/**
 * <p>
 *  服务类
 * </p>
 *
 * @author luke.miao
 * @since 2022-08-04
 */
public interface IComponentTagRefService extends IService<ComponentTagRef> {

  List<String> getComponentIdsByTagIds(List<String> tagIds);
  List<String> getComponentIdsByTagName(String name);
  List<ComponentTagRef> getComponentTagRefsByComponentIds(List<String> ComponentIds);
  void delComponentTagRefsByComponentId(String componentId);
}
