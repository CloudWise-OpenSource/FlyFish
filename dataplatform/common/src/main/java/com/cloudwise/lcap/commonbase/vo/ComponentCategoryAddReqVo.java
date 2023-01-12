package com.cloudwise.lcap.commonbase.vo;

import javax.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ComponentCategoryAddReqVo {
  String parentId;
  @NotBlank(message = "name 不能为空")
  String name;
  String icon;

}
