package com.cloudwise.lcap.commonbase.dto;

import lombok.*;

import java.util.List;


@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class CombineQueryDto {

    //1=简单查询（默认类型） 2=单值复合  3=多值按行复合 4=多值按列复合 5=时序值复合
    private Integer queryType;
    private List<String> combineIds;
}
