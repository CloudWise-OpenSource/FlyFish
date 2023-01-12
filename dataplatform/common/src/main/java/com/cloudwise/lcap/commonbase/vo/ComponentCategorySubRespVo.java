package com.cloudwise.lcap.commonbase.vo;

import lombok.Data;

import java.util.List;

@Data
public class ComponentCategorySubRespVo {
  String id;
  String name;
  private String icon;
  List<ComponentRespVo> components;
}
