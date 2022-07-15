package com.cloudwise.lcap.api.common;

import lombok.*;

import java.io.Serializable;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class PageResult<T> implements Serializable {

    private int pageNo;
    private int pageSize;
    private Long total;
    private List<T> data;

}
