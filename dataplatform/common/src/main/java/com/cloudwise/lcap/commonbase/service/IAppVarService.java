package com.cloudwise.lcap.commonbase.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.cloudwise.lcap.commonbase.entity.AppVar;
import com.cloudwise.lcap.commonbase.vo.*;

import java.util.List;

public interface IAppVarService extends IService<AppVar> {

    List<AppVarListResVo> getList(AppVarListReqVo listInfo);

    void batchCreateAppVar(List<AppVarReqVo> newAppVars);

    IdRespVo createAppVar(AppVarReqVo newAppVar);

    void updateAppVar(String id, AppVarReqVo appVar);

    void deleteAppVar(IdsReqVo idsReq);

    void deleteVarsByAppId(String appId);
}
