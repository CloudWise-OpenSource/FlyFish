package com.cloudwise.lcap.source.model;

import lombok.*;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.Date;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Document("import_result")
public class ImportResult {

    @Field("_id")
    private ObjectId id;

    // 标识
    @Field("key")
    private String key;

    // 导入类型
    @Field("type")
    private String type;

    // 导入结果  0：导入失败  1：导入成功
    @Field("status")
    private String status;

    @Field("creator")
    private String creator;

    @Field("updater")
    private String updater;

    @Field("create_time")
    private Date createTime;

    @Field("update_time")
    private Date updateTime;
}
