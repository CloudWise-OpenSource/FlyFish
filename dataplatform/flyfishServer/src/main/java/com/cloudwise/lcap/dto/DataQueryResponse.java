package com.cloudwise.lcap.dto;

import cn.hutool.json.JSONObject;
import cn.hutool.json.JSONUtil;
import com.cloudwise.lcap.commonbase.entity.DataQuery;
import com.cloudwise.lcap.commonbase.util.JsonUtils;
import lombok.*;
import org.apache.commons.lang3.StringUtils;

import java.io.Serializable;
import java.util.Date;
import java.util.Map;

/**
 * 可视化组件设置
 * 可视化组件 + 数据源 + sql + jsonpath 定义一个数据模型
 * 当数据源是http类型时，不需要sql
 * @author yinqiqi
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class DataQueryResponse implements Serializable {

    /**
     * queryId
     */
    private String settingId;
    private String datasourceId;
    private String datasourceName;
    private String schemaType;
    private String schemaName;
    private String tableId;
    private String tableName;
    private String queryName;
    private Integer queryType;
    private Long accountId;
    /**
     * 组件配置项：如组件图形样式，x轴 y轴设置等
     */
    private Map<String,Object> setting;
    /**
     * 组件所需的数据用sql从数据源查询（如果是http数据则不需要sql）
     */
    private String sql;
    private Date createTime;
    private Date updateTime;

    public static DataQueryResponse transfer(DataQuery dataQuery){
        DataQueryResponse build = DataQueryResponse.builder().settingId(dataQuery.getId())
                .datasourceId(dataQuery.getDataSourceId()).queryName(dataQuery.getQueryName()).queryType(dataQuery.getQueryType())
                .tableId(dataQuery.getTableId()).sql(dataQuery.getSql()).accountId(dataQuery.getAccountId())
                .createTime(dataQuery.getCreateTime()).updateTime(dataQuery.getUpdateTime())
                //这一行主要为了兼容cn.hutool.json.JSONObject与springboot的fastjson不兼容问题
                .schemaName("").tableName("").schemaType("").datasourceName("")
                .build();
        String setting = dataQuery.getSetting();
        if (StringUtils.isNotBlank(setting)){
            JSONObject setting1 = JSONUtil.parseObj(setting);
            build.setSetting(setting1);
        }
        return build;
    }
}
