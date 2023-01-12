package com.cloudwise.lcap.commonbase.entity;

import com.baomidou.mybatisplus.annotation.FieldFill;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
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
 * @since 2022-08-01
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
@TableName("data_query")
public class DataQuery implements Serializable {
    private static final long serialVersionUID = 1L;
    @TableId
    private String id;
    private String dataSourceId;
    private String tableId;
    private String queryName;
    //1-简单查询 2-单值复合 3-多值按行复合 4-多值按列复合 5-时序值复合
    private Integer queryType;
    private String setting;
    @TableField("`sql`")
    private String sql;
    @TableField(fill = FieldFill.INSERT)
    private Long accountId;
    private Integer deleted;
    @TableField(fill = FieldFill.INSERT)
    private Long creator;
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private Long updater;
    @TableField(fill = FieldFill.INSERT)
    private Date createTime;
    @TableField(fill = FieldFill.INSERT_UPDATE,update = "now()")
    //@TableField(update = "now()")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date updateTime;

}
