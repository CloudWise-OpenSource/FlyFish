package com.cloudwise.lcap.commonbase.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.cloudwise.lcap.commonbase.entity.Trade;
import com.cloudwise.lcap.commonbase.vo.TradeVo;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * @author JD
 */
@Mapper
@Repository
public interface TradeMapper extends BaseMapper<Trade> {


    List<TradeVo> findTradesByProjectIds(@Param("projectIds")List<String> projectIds);
}
