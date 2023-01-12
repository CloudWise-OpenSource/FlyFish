package com.cloudwise.lcap.commonbase.entity;

import com.baomidou.mybatisplus.annotation.FieldFill;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;

import java.io.Serializable;
import java.util.Date;

/**
 * <p>
 *  角色实体类
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
@TableName("role")
public class Role implements Serializable{

    private static final long serialVersionUID = 1L;

    /**
     * id
     */
    @TableField(fill = FieldFill.INSERT)
    private String id;

    /**
     * 是否合法
     */
    @TableField("`status`")
    private String status;

    /**
     * 角色名
     */
    @TableField("`name`")
    private String name;

    /**
     * 描述
     */
    @TableField("`desc`")
    private String desc;

    @TableField("menus")
    private String menus;

    /**
     * 更新人
     */
    @TableField("updater")
    private Long updater;

    /**
     * 创建人
     */
    @TableField("creator")
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
