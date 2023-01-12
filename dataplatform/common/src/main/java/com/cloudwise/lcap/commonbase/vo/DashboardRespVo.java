package com.cloudwise.lcap.commonbase.vo;

import lombok.Data;

@Data
public class DashboardRespVo {
  Long application;
  Long component;
  Long project;
  TplRespVo tpl;
  YaipRespVo yapi;

}
