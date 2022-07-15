package com.cloudwise.lcap.common;

import lombok.*;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@ToString
public class PageResult<T> {

    private int pageNo;
    private int pageSize;
    private Long total;
    private List<T> data;

    public PageResult(int pageNo, int pageSize, Long total, List<T> data) {
        this.pageNo = pageNo;
        this.pageSize = pageSize;
        this.total = total;
        this.data = data;
    }
}
