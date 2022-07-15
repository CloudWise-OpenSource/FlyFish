package com.cloudwise.lcap.source.model;

import lombok.*;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.Date;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Document("projects")
public class Project {

    @Field("_id")
    private ObjectId id;
    @Field("trades")
    private List<String> trades;
    @Field("is_internal")
    private Boolean is_internal;
    @Field("status")
    private String status;
    @Field("name")
    private String name;
    @Field("desc")
    private String desc;
    @Field("create_time")
    private Date createTime;
    @Field("update_time")
    private Date updateTime;
    @Field("creator")
    private String creator;
    @Field("updater")
    private String updater;
    @Field("from")
    private String from;
    @Field("accountId")
    private String accountId;

}
