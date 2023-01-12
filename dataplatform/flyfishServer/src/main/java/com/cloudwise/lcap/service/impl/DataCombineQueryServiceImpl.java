package com.cloudwise.lcap.service.impl;

import cn.hutool.core.collection.CollectionUtil;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.cloudwise.lcap.commonbase.entity.DataCombineQuery;
import com.cloudwise.lcap.commonbase.mapper.DataCombineQueryMapper;
import com.cloudwise.lcap.service.IDataCombineQueryService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

/**
 * <p>
 *  服务实现类
 * </p>
 *
 * @author luke.miao
 * @since 2022-08-01
 */
@Service
public class DataCombineQueryServiceImpl extends ServiceImpl<DataCombineQueryMapper, DataCombineQuery> implements IDataCombineQueryService {


    @Override
    public List<DataCombineQuery> queryByCombineQueryId(String combineQueryId) {
        LambdaQueryWrapper<DataCombineQuery> lambdaQueryWrapper = new LambdaQueryWrapper<>();
        lambdaQueryWrapper.eq(DataCombineQuery::getCombineQueryId,combineQueryId);
        return baseMapper.selectList(lambdaQueryWrapper);
    }

    @Override
    public List<DataCombineQuery> queryByCombineQueryIds(Collection<String> combineQueryIds) {
        if (CollectionUtil.isEmpty(combineQueryIds)){
            return new ArrayList<>();
        }
        LambdaQueryWrapper<DataCombineQuery> lambdaQueryWrapper = new LambdaQueryWrapper<>();
        lambdaQueryWrapper.in(DataCombineQuery::getCombineQueryId,combineQueryIds);
        return baseMapper.selectList(lambdaQueryWrapper);
    }


    @Override
    public List<DataCombineQuery> queryByRefQueryIds(Collection<String> refQueryIds){
        if (CollectionUtil.isEmpty(refQueryIds)){
            return new ArrayList<>();
        }
        LambdaQueryWrapper<DataCombineQuery> lambdaQueryWrapper = new LambdaQueryWrapper<>();
        lambdaQueryWrapper.in(DataCombineQuery::getRefQueryId,refQueryIds);
        return baseMapper.selectList(lambdaQueryWrapper);
    }

    @Override
    public void removeByCombineId(String combineQueryId) {
        baseMapper.deleteByCombineQueryId(combineQueryId);
    }

    @Override
    public void removeById(String id) {
        baseMapper.removeById(id);
    }
}
