package com.cloudwise.lcap.service;


import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.cloudwise.lcap.commonbase.entity.DataQuery;

import java.util.Collection;
import java.util.List;

/**
 * <p>
 *  服务类
 * </p>
 *
 * @author luke.miao
 * @since 2022-08-01
 */
public interface IDataQueryService extends IService<DataQuery> {

    List<DataQuery> findByDataSourceId(String dataSourceId);

    List<DataQuery> findByDataSourceIds(Collection<String> dataSourceIds);

    DataQuery findByQueryName(String queryName);

    List<DataQuery> findByQueryIds(Collection<String> queryIds);

    Page<DataQuery> findWithPage(Long pageNo, Long pageSize, Integer queryType,String queryName, Collection<String> dataQueryIds);
}
