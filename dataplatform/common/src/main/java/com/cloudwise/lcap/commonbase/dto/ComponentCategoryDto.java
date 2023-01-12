
package com.cloudwise.lcap.commonbase.dto;

import cn.hutool.json.JSONObject;
import com.cloudwise.lcap.commonbase.entity.Component;
import lombok.*;

import java.util.Date;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class ComponentCategoryDto {

    private String id;
    private List<JSONObject> categories;
    private Date createTime;
    private Date updateTime;

    private List<Component> componentList;

}
