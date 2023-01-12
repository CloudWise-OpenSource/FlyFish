package com.cloudwise.lcap.commonbase.vo;

import javax.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class TagVo {

  private String id;
  @NotBlank(message = "tag名称不能为空")
  private String name;

}
