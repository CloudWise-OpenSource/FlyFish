package com.cloudwise.lcap.commonbase.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.*;

import java.io.Serializable;
import java.util.Date;

/**
 *
 * @author ethan.du
 * @since 2022-08-01
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
@TableName("application_component_ref")
public class ApplicationComponentRef implements Serializable {
    private static final long serialVersionUID = 1L;
    @TableField(fill = FieldFill.INSERT)
    private String id;
    private String applicationId;
    private String componentId;
    /**
     * 0未删除 1已删除
     */
    private Integer deleted;
    @TableField(fill = FieldFill.INSERT)
    private Date createTime;
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private Date updateTime;
}
