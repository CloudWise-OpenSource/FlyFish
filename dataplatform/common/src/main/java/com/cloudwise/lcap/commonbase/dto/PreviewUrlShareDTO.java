package com.cloudwise.lcap.commonbase.dto;

import lombok.*;

@Data
@Builder
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class PreviewUrlShareDTO {
    private Long userId;
    private Long accountId;
    // 1-永久有效 2-1天有效 3-7天有效。4-30天有效
    private Integer expireType;
    private Long shareTime;
    // 剩余有效时间描述信息: 23天15小时
    private String availableTime;
    private Long expireTime;
    private String password;
    private String applicationId;
    private String shareKey;
    //0-取消分享 1-分享
    private Integer shareStatus;
}
