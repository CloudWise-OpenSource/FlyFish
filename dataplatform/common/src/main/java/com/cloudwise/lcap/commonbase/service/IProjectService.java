package com.cloudwise.lcap.commonbase.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.cloudwise.lcap.commonbase.entity.Project;
import com.cloudwise.lcap.commonbase.vo.IdRespVo;
import com.cloudwise.lcap.commonbase.vo.PageBaseListRespVo;
import com.cloudwise.lcap.commonbase.vo.ProjectReqVo;
import com.cloudwise.lcap.commonbase.vo.ProjectRespVo;

import java.util.List;

/**
 * <p>
 *  服务类
 * </p>
 *
 * @author ethan.du
 * @since 2022-08-01
 */
public interface IProjectService extends IService<Project> {

  IdRespVo add(ProjectReqVo projectCreateReqVo);
  void delete(String id);
  IdRespVo edit(String id, ProjectReqVo projectCreateReqVo);
  ProjectRespVo get(String id);
  PageBaseListRespVo getList(String key,Integer curPage,Integer pageSize);

  Project findByInitFrom(String initFrom);
  List<Project> getProjectList(List<String> id);
  Long getProjectCount();
}
