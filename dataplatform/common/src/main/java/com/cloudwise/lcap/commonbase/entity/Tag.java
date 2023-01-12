package com.cloudwise.lcap.commonbase.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;

import java.io.Serializable;
import java.util.Date;

/**
 * <p>
 * 
 * </p>
 *
 * @author june.yang
 * @since 2022-08-01
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
@TableName("tag")
public class Tag implements Serializable {
    private static final long serialVersionUID = 1L;

    @TableField(fill = FieldFill.INSERT)
    private String id;

    private Long accountId;

    private String name;

    private String type;

    @TableLogic
    private Integer deleted;

    @TableField(fill = FieldFill.INSERT)
    private Long creator;
    @TableField(fill = FieldFill.INSERT)
    private Long updater;
    @TableField(fill = FieldFill.INSERT)
    private Date createTime;
    @TableField(fill = FieldFill.INSERT_UPDATE,update = "now()")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date updateTime;

}
