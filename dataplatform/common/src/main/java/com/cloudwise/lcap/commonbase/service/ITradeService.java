package com.cloudwise.lcap.commonbase.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.cloudwise.lcap.commonbase.entity.Trade;
import com.cloudwise.lcap.commonbase.vo.PageBaseListRespVo;
import com.cloudwise.lcap.commonbase.vo.TradeVo;

import java.util.List;

/**
 * <p>
 *  服务类
 * </p>
 *
 * @author luke.miao
 * @since 2022-08-03
 */
public interface ITradeService extends IService<Trade> {

  List<String> getTradeIdByLikeName(String name);

  List<Trade> getTradesByIds(List<String> id);

  List<Trade> getTradesByName(List<String> name);

  PageBaseListRespVo getTradeList();

}
