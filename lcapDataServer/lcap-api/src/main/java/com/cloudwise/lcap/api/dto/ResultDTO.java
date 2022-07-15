package com.cloudwise.lcap.api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ResultDTO implements Serializable {
    /**
     * true 成功，false失败
     */
    private Boolean result;

    /**
     * 成功时是 0000
     * 失败时的失败信息
     */
    private String messageCode;
    /**
     * 失败时的失败信息
     */
    private String message;

    private DubboAsyncApiReq apiInfo;
}
