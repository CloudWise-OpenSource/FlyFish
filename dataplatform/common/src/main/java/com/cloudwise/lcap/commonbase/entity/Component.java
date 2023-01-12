package com.cloudwise.lcap.commonbase.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.*;

import java.io.Serializable;
import java.util.Date;

/**
 * <p>
 *
 * </p>
 *
 * @author ethan.du
 * @since 2022-08-01
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
@TableName("component")
public class Component  implements Serializable {
    private static final long serialVersionUID = 1L;

    @TableId("id")
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private String id;
    private String name;
    //组件类型 common-通用组件 project-项目组件
    private String type;
    /**
     * 是否数据组件库，0-否 1-是
     */
    private Integer isLib;
    private String dataConfig;
    private String initFrom;
    private String categoryId;
    private String subCategoryId;
    @TableField(value = "`desc`")
    private String desc;
    //组件封面
    private String cover;
    private String latestVersion;
    /**
     * 组件背景图生成方式 custom:手动上传（auto:自动生成方式已废弃{@since 5.7})
     */
    private String automaticCover;
    private Integer allowDataSearch;
    private String developStatus;
    @TableField(fill = FieldFill.INSERT)
    private Long accountId;
    @TableLogic
    private Integer deleted;
    @TableField(fill = FieldFill.INSERT)
    private Long creator;
    @TableField(fill = FieldFill.UPDATE)
    private Long updater;
    @TableField(fill = FieldFill.INSERT)
    private Date createTime;
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private Date updateTime;

}
