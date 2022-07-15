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
@Document("resource_import_records")
public class ResourceImportRecords {

    @Field("type")
    private String type;
    @Field("file_path_key")
    private String filePathKey;
    @Field("creator")
    private String creator;
    @Field("create_time")
    private Date createTime;
    @Field("update_time")
    private Date updateTime;
}
