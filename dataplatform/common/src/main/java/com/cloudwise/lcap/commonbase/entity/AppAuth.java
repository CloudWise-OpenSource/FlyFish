package com.cloudwise.lcap.commonbase.entity;

import java.io.Serializable;
import java.time.LocalDateTime;

import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;

import lombok.*;

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
@TableName("app_auth")
public class AppAuth implements Serializable {
    private static final long serialVersionUID = 1L;
    @TableId
    private String appId;
    private Long accountId;
    private String appName;
    private String remark;
    private String appKey;
    private String appSecret;
    private String accessParams;
    private String trafficStrategy;
    private Integer deleted;
    private Long creator;
    private Long updater;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
}
