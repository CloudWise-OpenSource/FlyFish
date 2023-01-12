package com.cloudwise.lcap.commonbase.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
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
 * @since 2022-08-01
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
@TableName("data_combine_query")
public class DataCombineQuery implements Serializable {
    private static final long serialVersionUID = 1L;

    @TableId(value = "id")
    private String id;
    private String combineQueryId;
    private String refQueryId;
    private Integer deleted;
    private Date createTime;
    private Date updateTime;

}
