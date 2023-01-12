package com.cloudwise.lcap.helper;

import cn.hutool.json.JSONArray;
import cn.hutool.json.JSONObject;
import com.cloudwise.lcap.commonbase.entity.DataQuery;
import com.cloudwise.lcap.commonbase.exception.BizException;
import com.cloudwise.lcap.commonbase.exception.ParameterException;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;

import java.util.HashSet;
import java.util.Map;
import java.util.Set;

/**
 * 数据查询模块辅助类
 * @author adam
 */
@Slf4j
public class DataQueryHelper {

    /**
     * 通过sql获取占位符参数名称
     * @param sql
     * @return
     */
    private static Set<String> getParamsBySql(String sql){
        if (StringUtils.isBlank(sql)) {
            throw new ParameterException("sql语句为空！");
        }
        Set<String> list = new HashSet<>();
        if (!sql.contains("{{")) {
            return list;
        }
        char[] chars = sql.toCharArray();
        boolean past = false;
        boolean scaning = false;
        StringBuilder tempParam = new StringBuilder();
        for (char c : chars) {
            if ('{'==c) {
                if (past==true) {
                    scaning = true;
                    past = false;
                } else {
                    past = true;
                }
            } else if ('}'==c) {
                if (scaning) {
                    scaning = false;
                    list.add(tempParam.toString());
                    tempParam = new StringBuilder();
                }
            } else if (scaning) {
                tempParam.append(c);
            }
        }
        return list;
    }


    /**
     * 替换sql占位符
     * @param unitSetting
     * @param params
     * @param useDefault
     * @return
     */
    public static String getSqlBySearchParam(DataQuery unitSetting, Map<String, String> params, boolean useDefault){
        String sql = unitSetting.getSql();
        //如果sql没有占位符直接返回
        if (!sql.contains("{{")) {
            return sql;
        }
        if (params != null) {
            String queryName = unitSetting.getQueryName();
            for (String key : params.keySet()) {
                String value = params.get(key);
                //先用完整的key替换一遍
                String placeHolder = "{{" + key + "}}";
                sql = sql.replace(placeHolder,value);
                //考虑组合查询多个参数问题
                if (key.contains("_") && key.startsWith(queryName)) {
                    String[] s = key.split("_");
                    key = s[s.length-1];
                }
                placeHolder = "{{" + key + "}}";
                sql = sql.replace(placeHolder,value);
            }
        }
        //仍然存在占位符
        if (sql.contains("{{")) {
            if (useDefault) {
                //允许使用默认参数则使用默认参数替换
                JSONObject setting = new JSONObject(unitSetting.getSetting());
                JSONArray defaultParams = setting.getJSONArray("params");
                for (Object object : defaultParams) {
                    JSONObject json = new JSONObject(object);
                    String name = json.getStr("name");
                    String placeHolder = "{{" + name + "}}";
                    String defaultValue = json.getStr("default");
                    sql = sql.replace(placeHolder,defaultValue);
                }
                if (sql.contains("{{")) {
                    throw new BizException(String.join(",",getParamsBySql(sql)) + "参数未设置");
                }
                return sql;
            }
            log.warn("sql动态参数替换异常，当前sql为：" + sql);
            throw new BizException(String.join(",",getParamsBySql(sql)) + "参数未设置");
        }
        return sql;
    }

}

