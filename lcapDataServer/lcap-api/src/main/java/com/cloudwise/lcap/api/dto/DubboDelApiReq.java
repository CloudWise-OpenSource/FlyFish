package com.cloudwise.lcap.api.dto;

import lombok.*;

import java.io.Serializable;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class DubboDelApiReq implements Serializable {
    /**
     * 待删除的apiId 列表
     */
    private List<String> apiIds;
    /**
     * 租户id
     */
    private String accountId;
    /**
     * 用户id
     */
    private String userId;
}
