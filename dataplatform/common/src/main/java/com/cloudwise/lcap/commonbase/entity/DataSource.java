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
@TableName("data_source")
public class DataSource implements Serializable {
    private static final long serialVersionUID = 1L;
    @TableId("id")
    @TableField("id")
    private String datasourceId;
    @TableField("name")
    private String datasourceName;
    private String schemaName;
    private String schemaType;
    private String connectData;
    private Long accountId;
    private Integer deleted;
    private Long creator;
    private Long updater;
    private Date createTime;
    @TableField(fill = FieldFill.INSERT_UPDATE,update = "now()")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date updateTime;
}
