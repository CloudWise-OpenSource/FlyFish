package com.cloudwise.lcap.commonbase.service;

import com.cloudwise.lcap.commonbase.entity.ProjectTradeRef;
import com.baomidou.mybatisplus.extension.service.IService;
import java.util.List;

/**
 * <p>
 *  服务类
 * </p>
 *
 * @author ethan.du
 * @since 2022-08-01
 */
public interface IProjectTradeRefService extends IService<ProjectTradeRef> {

  List<ProjectTradeRef> getProjectTradeRefsByProjectId(List<String> projectIds);

  List<String> getProjectIdByTradeIds(List<String> tradeIds);

  List<String> getTradeIdsByProjectId(String projectId);
  void deleteProjectTradeRefByProjectId(String projectId);
}
