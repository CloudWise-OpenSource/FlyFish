package com.cloudwise.lcap.commonbase.entity;

import com.baomidou.mybatisplus.annotation.FieldFill;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.*;
import java.util.Date;

/**
 * 租户相关实体类
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
@TableName("account")
public class Account {
    /**
     * 租户id
     */
    @TableId
    @TableField(fill = FieldFill.INSERT)
    private String id;
    /**
     * 租户姓名
     */
    @TableField("name")
    private String name;
    /**
     * 类型
     */
    @TableField("`type`")
    private String type;

    @TableField(fill = FieldFill.INSERT)
    private Date createTime;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private Date updateTime;
}
