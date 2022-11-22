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
@Document("users")
public class User {

    @Field("_id")
    private ObjectId id;

    @Field("email")
    private String email;

    @Field("is_douc")
    private Boolean idDouc;

    @Field("password")
    private String password;

    @Field("phone")
    private String phone;

    @Field("role")
    private String role;

    @Field("status")
    private String status;

    @Field("username")
    private String username;

    @Field("create_time")
    private Date createTime;

    @Field("update_time")
    private Date updateTime;
}
