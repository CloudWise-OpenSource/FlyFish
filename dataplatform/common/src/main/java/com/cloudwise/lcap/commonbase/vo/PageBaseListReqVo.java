package com.cloudwise.lcap.commonbase.vo;

import lombok.Data;


@Data
public class PageBaseListReqVo {

  /**
   * 当前页码
   */
  private Integer curPage=1;

  /**
   * 每页数量
   */
  private Integer pageSize=10;
}
