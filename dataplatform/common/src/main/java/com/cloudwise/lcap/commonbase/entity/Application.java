package com.cloudwise.lcap.commonbase.entity;

import com.baomidou.mybatisplus.annotation.FieldFill;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.*;

import com.baomidou.mybatisplus.annotation.TableLogic;

import javax.validation.constraints.NotBlank;
import java.io.Serializable;
import java.util.Date;
import java.util.List;

/**
 * @author ethan.du
 * @since 2022-08-01
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
@TableName("application")
public class Application implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableField(fill = FieldFill.INSERT)
    private String id;
    private String name;
    /**
     * 大屏封面图
     */
    private String cover;
    /**
     * 大屏的配置信息：包括大屏页码，大屏中的组件配置等
     */
    private String pages;
    /**
     * 大屏类型 2D 3D
     */
    private String type;
    /**
     * 大屏状态：doing develop
     */
    private String developStatus;

    @TableField(fill = FieldFill.INSERT)
    private Long accountId;
    //是否属于模版库 0-否 1-属于
    private Integer isLib;
    //是否推荐至工作台
    private Integer isRecommend;
    private String projectId;
    @TableLogic
    private Integer deleted;
    //0-不在回收站 1-在回收站
    private Integer invalid;
    @TableField(fill = FieldFill.INSERT)
    private Long creator;
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private Long updater;
    private String initFrom;
    private String models;
    private String modelId;
    @TableField(fill = FieldFill.INSERT)
    private Date createTime;
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private Date updateTime;
}
