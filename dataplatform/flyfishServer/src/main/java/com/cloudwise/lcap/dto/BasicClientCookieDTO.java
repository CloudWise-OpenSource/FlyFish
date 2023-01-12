package com.cloudwise.lcap.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class BasicClientCookieDTO {
    private String cookieName;
    private String cookieValue;
    private int version;
    private String path;
    private String domain;
    private String expireDate;
}
