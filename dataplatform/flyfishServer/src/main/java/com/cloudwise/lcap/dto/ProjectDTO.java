package com.cloudwise.lcap.dto;

import com.cloudwise.lcap.commonbase.entity.Application;
import lombok.Builder;
import lombok.Data;
import lombok.ToString;

import java.util.List;

/**
 * 项目+应用 二级结构
 */
@Data
@Builder
@ToString
public class ProjectDTO {

  private String projectId;
  private String projectName;

  private List<Application> applicationList;

}
