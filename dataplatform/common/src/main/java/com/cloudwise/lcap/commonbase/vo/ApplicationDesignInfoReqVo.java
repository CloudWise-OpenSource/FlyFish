package com.cloudwise.lcap.commonbase.vo;

import cn.hutool.json.JSONObject;
import lombok.Data;

import java.util.List;

@Data
public class ApplicationDesignInfoReqVo {

    private List<JSONObject> pages;
    private List<AppVarReqVo> variables;
}
