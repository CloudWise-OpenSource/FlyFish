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
public class PageResultOfOpenSource<T> {

    private Long curPage;
    private Long pageSize;
    private Long total;
    private List<T> list;

    public PageResultOfOpenSource(Long curPage, Long pageSize, Long total, List<T> list) {
        this.curPage = curPage;
        this.pageSize = pageSize;
        this.total = total;
        this.list = list;
    }
}
