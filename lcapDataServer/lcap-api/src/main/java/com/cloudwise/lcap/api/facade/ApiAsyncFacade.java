package com.cloudwise.lcap.api.facade;

import com.cloudwise.lcap.api.common.*;
import com.cloudwise.lcap.api.dto.*;

import java.io.File;
import java.util.List;

public interface ApiAsyncFacade {


    /**
     * yapi导出的swaggerApi.json文档
     */
    DubboCommonResp<List<ResultDTO>> initApi(File swaggerFile);

    /***
     * 同步接口信息
     * @param apiList
     * @return
     */
    DubboCommonResp<List<ResultDTO>> syncApiList(List<DubboAsyncApiReq> apiList);


    /**
     * 接口上下线
     * @param apiReq
     * @return
     */
    DubboCommonResp<ResultDTO> updateApiStatus(DubboAsyncApiReq apiReq);

    /**
     * 删除api
     */
    DubboCommonResp<List<ResultDTO>> deleteApiList(DubboDelApiReq req);


    public DubboCommonResp<PageResult<DubboAsyncApiResp>> queryApiList(DubboQueryApiReq req);
}
