package com.cloudwise.lcap.commonbase.vo;

import java.util.Date;
import java.util.HashMap;
import java.util.List;

import cn.hutool.json.JSONObject;
import cn.hutool.json.JSONUtil;
import com.baomidou.mybatisplus.annotation.TableField;
import com.cloudwise.lcap.commonbase.entity.Component;
import com.cloudwise.lcap.commonbase.util.JsonUtils;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import org.apache.commons.lang3.StringUtils;

@Data
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ComponentRespVo {
    private String id;
    private Boolean isLib;
    private String name;
    private String desc;
    private String type;
    private String automaticCover;
    private Integer allowDataSearch;
    private String category;
    private String cover;
    private String developStatus;
    private String initFrom;
    private Long accountId;
    private List<ProjectRespVo> projects;
    private String creator;
    private String subCategory;
    private List<TagVo> tags;

    private Date createTime;
    private Date updateTime;
    private String version;
    private Object dataConfig;
    private List<ComponentVersionVo> versions;


    public static ComponentRespVo dtoToBean(Component component) {
        Integer isLib = component.getIsLib();
        JSONObject dataConfig = new JSONObject();
        if (StringUtils.isNotBlank(component.getDataConfig())) {
            dataConfig = JSONUtil.parseObj(component.getDataConfig());
        }
        return ComponentRespVo.builder().id(component.getId())
                .isLib((isLib == null || isLib == 0) ? false : true)
                .name(component.getName()).desc(component.getDesc())
                .type(component.getType()).automaticCover(component.getAutomaticCover())
                .allowDataSearch(component.getAllowDataSearch()).category(component.getCategoryId()).cover(component.getCover())
                .developStatus(component.getDevelopStatus()).initFrom(component.getInitFrom())
                .accountId(component.getAccountId()).creator(String.valueOf(component.getCreator())).subCategory(component.getSubCategoryId())
                .version(component.getLatestVersion()).dataConfig(dataConfig).createTime(component.getCreateTime())
                .updateTime(component.getUpdateTime()).build();
    }
}
