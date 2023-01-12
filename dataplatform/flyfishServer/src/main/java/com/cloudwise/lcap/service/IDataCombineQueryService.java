package com.cloudwise.lcap.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.cloudwise.lcap.commonbase.entity.DataCombineQuery;

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
public interface IDataCombineQueryService extends IService<DataCombineQuery> {

    List<DataCombineQuery> queryByCombineQueryId(String combineQueryId);

    List<DataCombineQuery> queryByCombineQueryIds(Collection<String> combineQueryIds);


    List<DataCombineQuery> queryByRefQueryIds(Collection<String> refQueryIds);

    /**
     * 根据关联id删除关联关系
     * @param combineQueryId
     */
    void removeByCombineId(String combineQueryId);

    /**
     * 根据combineQueryId删除记录
     * @param combineQueryId
     */
    void removeById(String combineQueryId);
}
