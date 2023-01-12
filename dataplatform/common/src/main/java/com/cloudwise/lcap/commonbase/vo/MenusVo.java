package com.cloudwise.lcap.commonbase.vo;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.util.List;

/**
 * @author dana.wang
 * @since 2022-12-27
 */
@Data
public class MenusVo {
    private String name;
    private Integer index;
    private String url;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private List<MenusVo> children;
}
