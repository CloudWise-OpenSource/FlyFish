package com.cloudwise.lcap.commonbase.vo;

import com.cloudwise.lcap.commonbase.enums.ComponentType;
import com.cloudwise.lcap.commonbase.validation.EnumValid;
import lombok.Data;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import java.util.List;

@Data
public class ComponentReqDevVo {
 private String name;
 @EnumValid(message = "组件类型只能是common或project",enumClass = ComponentType.class )
 private String type;
 private Boolean isLib;
 private List<String> projects;
 @Valid
 private List<TagVo> tags;
 @NotBlank(message = "category不能为空")
 private String category;
 @NotBlank(message = "subCategory不能为空")
 private String subCategory;
 private String desc;
 private String automaticCover;
 private String componentCover;
}
