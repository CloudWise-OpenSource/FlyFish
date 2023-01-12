package com.cloudwise.lcap.commonbase.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.cloudwise.lcap.commonbase.dto.PreviewUrlShareDTO;
import com.cloudwise.lcap.commonbase.entity.Application;
import com.cloudwise.lcap.commonbase.vo.*;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

/**
 * <p>
 * 服务类
 * </p>
 *
 * @author ethan.du
 * @since 2022-08-01
 */
public interface IApplicationService extends IService<Application> {
    public IdRespVo install(ApplicationInstallReqVo installInfo);
    void editBasicInfo(String id, ApplicationBasicInfoReqVo basicInfo);

    void editDesignInfo(String id, ApplicationDesignInfoReqVo designInfo);

    PageBaseListRespVo list(ApplicationListReqVo queryInfo);

    Long getApplicationsCount(ApplicationListReqVo queryInfo);

    PreviewUrlShareDTO generatorSharePreviewUrl(String applicationId);
}