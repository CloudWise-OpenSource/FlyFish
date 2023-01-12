package com.cloudwise.lcap.controller;


import com.cloudwise.lcap.commonbase.service.ITradeService;
import com.cloudwise.lcap.commonbase.vo.PageBaseListRespVo;
import com.cloudwise.lcap.commonbase.vo.TagVo;
import com.cloudwise.lcap.commonbase.vo.TradeVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * <p>
 *  前端控制器
 * </p>
 *
 * @author june.yang
 * @since 2022-08-01
 */
@RestController
@RequestMapping("/trades")
public class TradeController {

    @Autowired
    ITradeService iTradeService;
    @GetMapping("")
    public PageBaseListRespVo getTradeList(){
        return iTradeService.getTradeList();
    }

}
