package com.cloudwise.lcap.controller;

import com.cloudwise.lcap.commonbase.service.IApplicationService;
import com.cloudwise.lcap.commonbase.vo.*;
import com.cloudwise.lcap.service.ApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

/**
 * <p>
 * 前端控制器
 * </p>
 *
 * @author ethan.du
 * @since 2022-08-01
 */
@RestController
@RequestMapping("/applications")
public class ApplicationController {

    @Autowired
    private IApplicationService iApplicationService;
    @Autowired
    private ApplicationService applicationService;

    /**
     * 新建大屏,两个问题：
     * 1.新建大屏时应该创建对应的大屏文件夹
     * 2.大屏封面图 /lcapWeb/www/application_tpl/public/cover.jpeg 应复制一份到对应的大屏文件夹下
     * @param basicInfo
     * @return
     */
    @Deprecated
    @PostMapping("")
    public IdRespVo create(@Validated @RequestBody ApplicationCreateReqVo basicInfo) {
        return applicationService.create(basicInfo);
    }

    /**
     * @param installInfo
     * @return
     */
    @PostMapping("/install")
    public IdRespVo install(@Validated @RequestBody ApplicationInstallReqVo installInfo) {
        return iApplicationService.install(installInfo);
    }

    /**
     * 查看大屏基础信息
     *
     * @param id
     * @return
     */
    @GetMapping(value = {"/{id}", "/info/{id}"})
    public ApplicationDetailRespVo getBasicInfo(@PathVariable String id) {
        return applicationService.getBasicInfo(id);
    }

    @PutMapping("/{id}/basic")
    public IdRespVo editBasicInfo(@PathVariable String id,
                                  @Validated @RequestBody ApplicationBasicInfoReqVo basicInfo) {
        iApplicationService.editBasicInfo(id, basicInfo);
        IdRespVo idRespVo = new IdRespVo();
        idRespVo.setId(id);
        return idRespVo;
    }

    @PutMapping("/{id}/design")
    public void editDesignInfo(@PathVariable String id, @Validated @RequestBody ApplicationDesignInfoReqVo designInfo) {
        iApplicationService.editDesignInfo(id, designInfo);
    }

    @DeleteMapping("/{id}")
    public IdRespVo deleteApp(@PathVariable String id) {
        return applicationService.delete(id);
    }


    @PostMapping("/list")
    public PageBaseListRespVo list(@Validated @RequestBody ApplicationListReqVo queryInfo) {
        return iApplicationService.list(queryInfo);
    }


}
