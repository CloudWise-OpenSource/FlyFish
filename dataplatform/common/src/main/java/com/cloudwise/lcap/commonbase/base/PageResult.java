package com.cloudwise.lcap.commonbase.base;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@ToString
public class PageResult<T> {

    private Long pageNo;
    private Long pageSize;
    private Long total;
    private List<T> data;

    public PageResult(Long pageNo, Long pageSize, Long total, List<T> data) {
        this.pageNo = pageNo;
        this.pageSize = pageSize;
        this.total = total;
        this.data = data;
    }
}
