package com.cloudwise.lcap.commonbase.vo;

import cn.hutool.json.JSONObject;
import cn.hutool.json.JSONUtil;
import com.cloudwise.lcap.commonbase.entity.Component;
import lombok.Builder;
import lombok.Data;
import org.apache.commons.lang3.StringUtils;

import java.util.List;

@Data
@Builder
public class ComponentInfoRespVo {
  private String id;
  private Boolean isLib;
  private String name;
  private String type;
  private String desc;
  private String developStatus;
  private List<ProjectRespVo> projects;
  private UserInfoVo creatorInfo;
  private List<TagVo> tags;
  private Object dataConfig;
  private List<ComponentVersionVo> versions;

  public static ComponentInfoRespVo dtoToBean(Component component){
    Integer isLib = component.getIsLib();
    JSONObject dataConfig = new JSONObject();
    if (StringUtils.isNotBlank(component.getDataConfig())){
       dataConfig = JSONUtil.parseObj(component.getDataConfig());
    }
    return ComponentInfoRespVo.builder().id(component.getId()).isLib((null == isLib || isLib == 0)?false:true).name(component.getName())
            .type(component.getType()).developStatus(component.getDevelopStatus())
            .desc(component.getDesc())
            .dataConfig(dataConfig).build();
  }
}
