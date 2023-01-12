package com.cloudwise.lcap.commonbase.vo;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CommonReleaseReqVo {
  @NotNull(message = "compatible 不能为空")
  private Boolean compatible;
  private String no;
  private String desc;
}
