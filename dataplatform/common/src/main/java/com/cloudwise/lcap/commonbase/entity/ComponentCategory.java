package com.cloudwise.lcap.commonbase.entity;

import com.baomidou.mybatisplus.annotation.FieldFill;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableLogic;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.*;

import java.io.Serializable;
import java.util.Date;

/**
 * <p>
 * 
 * </p>
 *
 * @author luke.miao
 * @since 2022-08-08
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
@TableName("component_category")
public class ComponentCategory implements Serializable {

    private static final long serialVersionUID = 1L;
    @TableField(fill = FieldFill.INSERT)
    private String id;
    private String name;
    private String initFrom;
    /**
     * 顶级分类 parent_id=-1
     */
    private String parentId;
    private String icon;
    @TableField(fill = FieldFill.INSERT)
    private Long accountId;
    /**
     * 0未删除 1已删除
     */
    @TableLogic
    private Integer deleted;
    @TableField(fill = FieldFill.INSERT)//插入时自动填充
    private Long creator;
    @TableField(fill = FieldFill.INSERT_UPDATE)//插入时自动填充
    private Long updater;
    @TableField(fill = FieldFill.INSERT)
    private Date createTime;
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private Date updateTime;

}
