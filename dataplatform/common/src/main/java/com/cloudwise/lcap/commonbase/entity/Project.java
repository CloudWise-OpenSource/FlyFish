package com.cloudwise.lcap.commonbase.entity;

import com.baomidou.mybatisplus.annotation.FieldFill;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableLogic;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;

import java.io.Serializable;
import java.util.Date;

/**
 * <p>
 * 
 * </p>
 *
 * @author luke.miao
 * @since 2022-08-03
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
@TableName("project")
public class Project implements Serializable {

    private static final long serialVersionUID = 1L;
    @TableId("id")
    @TableField(fill = FieldFill.INSERT)
    private String id;

    private String name;
    private String initFrom;
    @TableField(value = "`desc`")
    private String desc;
    @TableLogic
    private Integer deleted;

    @TableField(fill = FieldFill.INSERT)//插入时自动填充
    private Long accountId;
    @TableField(fill = FieldFill.INSERT)//插入时自动填充
    private Long creator;
    @TableField(fill = FieldFill.INSERT_UPDATE)//插入时自动填充
    private Long updater;
    @TableField(fill = FieldFill.INSERT)
    private Date createTime;
    @TableField(fill = FieldFill.INSERT_UPDATE,update = "now()")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date updateTime;

}
