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
 * @since 2022-08-04
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
@TableName("application_project_ref")
public class ApplicationProjectRef implements Serializable {

    private static final long serialVersionUID = 1L;
    @TableField(fill = FieldFill.INSERT)
    private String id;

    private String projectId;

    private String applicationId;
    @TableField(fill = FieldFill.INSERT)
    private Date createTime;
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private Date updateTime;

    /**
     * 0未删除 1已删除
     */
    @TableLogic
    private Integer deleted;
}
