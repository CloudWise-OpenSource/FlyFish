package com.cloudwise.lcap.api.enums;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

public enum SourceType {
    DODP("dodp","数据平台"),
    DOSM("dosm","IT服务管理"),
    DOIM("doim","基础设施监控"),
    DOEM("doem","事件中心"),
    AUTOMATION("automation","自动化"),
    LCAP("lcap","低代码开发平台");

    private String sourceAppId;
    private String sourceAppName;

    SourceType(String sourceAppId,String sourceAppName) {
        this.sourceAppId = sourceAppId;
        this.sourceAppName = sourceAppName;
    }

    public String getSourceAppId(){
        return sourceAppId;
    }
    public String getSourceAppName(){
        return sourceAppName;
    }
    public static SourceType find(String sourceAppId){
        if (null == sourceAppId || sourceAppId.length() == 0){
            return null;
        }
        List<SourceType> arrayList = Arrays.asList(values());
        for (SourceType type : arrayList) {
            if (type.getSourceAppId().equals(sourceAppId)){
                return type;
            }
        }
        return null;
    }
}
