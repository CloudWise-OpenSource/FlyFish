package com.cloudwise.lcap.commonbase.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.cloudwise.lcap.commonbase.contants.Constant;
import com.cloudwise.lcap.commonbase.entity.Project;
import com.cloudwise.lcap.commonbase.entity.Trade;
import com.cloudwise.lcap.commonbase.mapper.TradeMapper;
import com.cloudwise.lcap.commonbase.mapstruct.StructUtil;
import com.cloudwise.lcap.commonbase.threadlocal.ThreadLocalContext;
import com.cloudwise.lcap.commonbase.service.ITradeService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import com.cloudwise.lcap.commonbase.vo.PageBaseListRespVo;
import com.cloudwise.lcap.commonbase.vo.TradeVo;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * <p>
 * 服务实现类
 * </p>
 *
 * @author luke.miao
 * @since 2022-08-03
 */
@Service
public class TradeServiceImpl extends ServiceImpl<TradeMapper, Trade> implements ITradeService {

    @Autowired
    StructUtil structUtil;
    @Override
    public List<String> getTradeIdByLikeName(String name) {
        Long accountId = ThreadLocalContext.getAccountId();
        LambdaQueryWrapper<Trade> tradeLambdaQueryWrapper = new LambdaQueryWrapper<>();
        tradeLambdaQueryWrapper.like(StringUtils.isNotEmpty(name), Trade::getName, name).in(Trade::getAccountId, Arrays.asList(accountId, Constant.INNER_ACCOUNT_ID));
        return baseMapper.selectList(tradeLambdaQueryWrapper)
                .stream().map(i -> i.getId()).collect(
                        Collectors.toList());
    }

    @Override
    public List<Trade> getTradesByIds(List<String> tradeIds) {
        LambdaQueryWrapper<Trade> tradeLQW = new LambdaQueryWrapper<>();
        tradeLQW.in(Trade::getId, tradeIds);
        return baseMapper.selectList(tradeLQW);
    }

    @Override
    public List<Trade> getTradesByName(List<String> newTradeNames) {
        Long accountId = ThreadLocalContext.getAccountId();
        LambdaQueryWrapper<Trade> tradeLambdaQueryWrapper = new LambdaQueryWrapper<>();
        tradeLambdaQueryWrapper.in(Trade::getName, newTradeNames).in(Trade::getAccountId, Arrays.asList(accountId, Constant.INNER_ACCOUNT_ID));
        return baseMapper.selectList(tradeLambdaQueryWrapper);
    }

    @Override
    public PageBaseListRespVo getTradeList() {
        Long accountId = ThreadLocalContext.getAccountId();
        LambdaQueryWrapper<Trade> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.in(Trade::getAccountId, Arrays.asList(accountId, Constant.INNER_ACCOUNT_ID)).orderByDesc(Trade::getUpdateTime);

        List<Trade> trades = baseMapper.selectList(queryWrapper);
        PageBaseListRespVo pageBaseListRespVo=new PageBaseListRespVo();
        pageBaseListRespVo.setList(structUtil.convertTradeVo(trades));

        return pageBaseListRespVo;
    }
}
