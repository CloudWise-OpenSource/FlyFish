package com.cloudwise.lcap.commonbase.vo;

import cn.hutool.json.JSONUtil;
import com.cloudwise.lcap.commonbase.entity.Component;
import lombok.Data;

import javax.validation.Valid;
import java.util.List;

@Data
public class ComponentReqVo {
    private String name;
    private String type;
    private List<String> projects;
    @Valid
    private List<TagVo> tags;
    private String category;
    private String subCategory;
    private String desc;
    /**
     * 组件封面图生成策略：custom auto
     */
    private String automaticCover;
    private String componentCover;
    private Object dataConfig;

    public static Component dtoToBean(ComponentReqVo dto) {
        Component build = Component.builder().name(dto.getName()).type(dto.getType()).categoryId(dto.getCategory())
                .subCategoryId(dto.getSubCategory()).desc(dto.getDesc()).automaticCover(dto.getAutomaticCover())
                .cover(dto.getComponentCover()).build();
        if (dto.getDataConfig() != null) {
            build.setDataConfig(JSONUtil.parseObj(dto.getDataConfig()).toString());
        }
        return build;
    }
}
