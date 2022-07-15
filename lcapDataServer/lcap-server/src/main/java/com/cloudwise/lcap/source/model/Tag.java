package com.cloudwise.lcap.source.model;

import lombok.*;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.Date;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Document("tags")
public class Tag {
    @Field("create_time")
    private Date create_time;
    @Field("update_time")
    private Date update_time;
    @Field("name")
    private String name;
    // 标签类型 enum#TAG_TYPE
    @Field("type")
    private String type;
    // 可用状态 enum#COMMON_STATUS
    @Field("status")
    private String status;

}
