package com.cloudwise.lcap.controller;

import com.cloudwise.lcap.commonbase.entity.AppVar;
import com.cloudwise.lcap.commonbase.service.IAppVarService;
import com.cloudwise.lcap.commonbase.vo.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * @author: june.yang
 * @create-date: 2022/11/4 3:42 PM
 */
@Slf4j
@RestController
@RequestMapping("/app-vars")
public class AppVarController {

    @Autowired
    IAppVarService iAppVarService;

    @PostMapping("/list")
    public List<AppVarListResVo> getList(@Validated  @RequestBody AppVarListReqVo listInfo){
        return iAppVarService.getList(listInfo);
    }

    @PostMapping("/")
    public IdRespVo createAppVar(@Validated @RequestBody AppVarReqVo newAppVar){
        return iAppVarService.createAppVar(newAppVar);
    }


    @PutMapping("/{id}")
    public void updateAppVar(@PathVariable String id, @Validated @RequestBody AppVarReqVo appVar){
        iAppVarService.updateAppVar(id, appVar);
    }

    @PostMapping("/delete")
    public void deleteAppVar(@RequestBody IdsReqVo idsReq){
        iAppVarService.deleteAppVar(idsReq);
    }
}
