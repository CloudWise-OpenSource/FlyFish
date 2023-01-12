package com.cloudwise.lcap.commonbase.vo;

import com.cloudwise.lcap.commonbase.enums.ComponentType;
import com.cloudwise.lcap.commonbase.validation.EnumValid;
import java.util.List;
import lombok.Data;

@Data
public class ComponentListReqVo extends PageBaseListReqVo{
  private String key;
  private String name;
  private List<String> tags;
  private List<String> trades;
  private String projectId;
  /**
   * 是否数据组件库，0-否 1-是
   */
  private Boolean isLib;
  private String developStatus;
  @EnumValid(message = "组件类型只能是common或project",enumClass = ComponentType.class )
  private String type;
  private String creator;
  private String category;
  private String subCategory;

}
