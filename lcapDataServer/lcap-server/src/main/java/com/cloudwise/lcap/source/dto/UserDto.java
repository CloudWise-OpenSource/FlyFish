package com.cloudwise.lcap.source.dto;

import lombok.*;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.Date;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class UserDto {

    private String id;

    @Field("douc_user_id")
    private String doucUserId;

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

    @Field("old_user_id")
    private Integer oldUserId;

    @Field("create_time")
    private Date createTime;

    @Field("update_time")
    private Date updateTime;
}
