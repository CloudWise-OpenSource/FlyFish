package com.cloudwise.lcap.source.model;

import cn.hutool.json.JSONObject;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.Date;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Document("component_categories")
public class ComponentCategory {

    @Id
    private String id;
    @Field("categories")
    private List<JSONObject> categories;
    private Date createTime;
    private Date updateTime;
}
