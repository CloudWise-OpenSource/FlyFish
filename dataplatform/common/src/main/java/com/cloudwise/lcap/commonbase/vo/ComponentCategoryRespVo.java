package com.cloudwise.lcap.commonbase.vo;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ComponentCategoryRespVo {
  String id;
  String name;
  String icon;
  List<ComponentCategorySubRespVo> children;
  List<ComponentCategorySubRespVo> subCategories;
}
