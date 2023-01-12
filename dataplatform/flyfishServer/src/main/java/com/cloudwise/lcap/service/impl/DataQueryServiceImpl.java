package com.cloudwise.lcap.service.impl;


import cn.hutool.core.collection.CollectionUtil;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.cloudwise.lcap.commonbase.entity.DataQuery;
import com.cloudwise.lcap.commonbase.entity.DataSource;
import com.cloudwise.lcap.commonbase.mapper.DataQueryMapper;
import com.cloudwise.lcap.commonbase.threadlocal.ThreadLocalContext;
import com.cloudwise.lcap.service.IDataQueryService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.List;

/**
 * <p>
 * 服务实现类
 * </p>
 *
 * @author luke.miao
 * @since 2022-08-01
 */
@Service
public class DataQueryServiceImpl extends ServiceImpl<DataQueryMapper, DataQuery> implements IDataQueryService {

    @Override
    public List<DataQuery> findByDataSourceId(String dataSourceId) {
        LambdaQueryWrapper<DataQuery> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(DataQuery::getDataSourceId, dataSourceId);
        queryWrapper.eq(DataQuery::getDeleted, 0);
        return baseMapper.selectList(queryWrapper);
    }

    @Override
    public List<DataQuery> findByDataSourceIds(Collection<String> dataSourceIds) {
        LambdaQueryWrapper<DataQuery> queryWrapper = new LambdaQueryWrapper<>();
        if (CollectionUtil.isNotEmpty(dataSourceIds)) {
            queryWrapper.in(DataQuery::getDataSourceId, dataSourceIds);
        }
        queryWrapper.eq(DataQuery::getDeleted, 0);
        queryWrapper.eq(DataQuery::getAccountId, ThreadLocalContext.getAccountId());
        return baseMapper.selectList(queryWrapper);
    }

    @Override
    public DataQuery findByQueryName(String queryName) {
        LambdaQueryWrapper<DataQuery> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(DataQuery::getQueryName, queryName);
        queryWrapper.eq(DataQuery::getDeleted, 0);
        queryWrapper.eq(DataQuery::getAccountId, ThreadLocalContext.getAccountId());
        return baseMapper.selectOne(queryWrapper);
    }

    @Override
    public List<DataQuery> findByQueryIds(Collection<String> queryIds) {
        LambdaQueryWrapper<DataQuery> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.in(DataQuery::getId, queryIds);
        queryWrapper.eq(DataQuery::getDeleted, 0);
        //queryWrapper.eq(DataQuery::getAccountId, ThreadLocalContext.getAccountId());
        return baseMapper.selectList(queryWrapper);
    }

    @Override
    public Page<DataQuery> findWithPage(Long pageNo, Long pageSize,Integer queryType, String queryName,  Collection<String> dataQueryIds) {
        LambdaQueryWrapper<DataQuery> queryWrapper = new LambdaQueryWrapper<>();
        if (StringUtils.isNotBlank(queryName)){
            queryWrapper.like(DataQuery::getQueryName, queryName);
        }
        if (null != queryType){
            queryWrapper.eq(DataQuery::getQueryType, queryType);
        }
        if (CollectionUtil.isNotEmpty(dataQueryIds)) {
            queryWrapper.in(DataQuery::getId, dataQueryIds);
        }
        queryWrapper.eq(DataQuery::getDeleted, 0);
        queryWrapper.orderByDesc(DataQuery::getUpdateTime);
        queryWrapper.eq(DataQuery::getAccountId, ThreadLocalContext.getAccountId());
        Page<DataQuery> dataQueryPage = baseMapper.selectPage(new Page<>(pageNo, pageSize), queryWrapper);
        return dataQueryPage;
    }
}
