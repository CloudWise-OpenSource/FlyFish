package com.cloudwise.lcap.commonbase.entity;

import com.baomidou.mybatisplus.annotation.FieldFill;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import com.cloudwise.lcap.commonbase.vo.MenusVo;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

/**
 * <p>
 * 用户表
 * </p>
 *
 * @author dana.wang
 * @since 2022-12-26
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
@TableName("user")
@EqualsAndHashCode(callSuper = false)
public class BaseUser implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * id
     */
    @TableField(fill = FieldFill.INSERT)
    private String id;

    /**
     * 用户名
     */
    @TableField("user_name")
    private String username;

    /**
     * 邮箱
     */
    private String email;

    /**
     * 电话
     */
    private String phone;

    /**
     * 密码
     */
    private String password;

    /**
     * 角色id
     */
    private String roleId;

    /**
     * 是否非法，是否禁用
     */
    private String status;

    /**
     * 是否是douc用户
     */
    private Boolean isDouc;

    @TableField(exist = false)
    private Boolean isAdmin;

    @TableField(exist = false)
    private List<MenusVo> menus;

    /**
     * 更新人
     */
    private Long updater;

    /**
     * 创建人
     */
    private Long creator;

    /**
     * 创建时间
     */
    @TableField(fill = FieldFill.INSERT)
    @DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date createTime;

    /**
     * 更新时间
     */
    @TableField(fill = FieldFill.INSERT_UPDATE,update = "now()")
    @DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date updateTime;

    /**
     * 当前页码
     */
    @TableField(exist = false)
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private Integer curPage=1;

    /**
     * 每页数量
     */
    @TableField(exist = false)
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private Integer pageSize=10;


}
