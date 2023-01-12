package com.cloudwise.lcap.commonbase.vo;


import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PageBaseListRespVo {

  /**
   * 当前页码
   */
  private Integer curPage;

  /**
   * 每页数量
   */
  private Integer pageSize;

  /**
   * 总条数
   */
  private Long total;
  /**
   * 返回数据
   */
  private List list;
}
