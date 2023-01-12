package com.cloudwise.lcap.commonbase.entity;

import com.baomidou.mybatisplus.annotation.TableId;
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
 * @author june.yang
 * @since 2022-08-01
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
@TableName("api")
public class Api implements Serializable {
    private static final long serialVersionUID = 1L;
    @TableId
    private String apiId;
    private Long accountId;
    private String apiName;
    private String catalogId;
    private String method;
    private String path;
    private String reqBody;
    private String reqHeaders;
    private String reqParams;
    private String resBody;
    private Integer sourceType;
    private Integer status;
    private String trafficStrategy;
    private String fuseStrategy;
    @TableLogic
    private Integer deleted;
    private Long creator;
    private Long updater;
    private Date createTime;
    private Date updateTime;
}
