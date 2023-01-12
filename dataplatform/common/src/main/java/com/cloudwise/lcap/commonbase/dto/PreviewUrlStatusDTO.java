package com.cloudwise.lcap.commonbase.dto;

import lombok.*;

@Data
@Builder
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class PreviewUrlStatusDTO {
    //0-正常 -1已过期或者key不正确
    private Integer statusCode = 0;
    //是否需要进行密码验证
    private Boolean encryption;
    private String applicationId;
    private String password;
    private String shareKey;
}
