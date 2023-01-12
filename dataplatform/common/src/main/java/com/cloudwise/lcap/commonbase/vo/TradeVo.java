package com.cloudwise.lcap.commonbase.vo;

import javax.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class TradeVo {
  private String id;
  @NotBlank(message = "行业名称不能为空")
  private String name;

  private String projectId;

}
