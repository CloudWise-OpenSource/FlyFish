package com.cloudwise.lcap.dataplateform.core.processor;

import com.cloudwise.lcap.dataplateform.core.model.ExecuteBean;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * json数组处理
 *
 * @author zhaobo
 * @date 2022/1/12
 */
@Service("jsonArrayProcessor")
@Slf4j
public class JSONArrayProcessor implements ProcessorService<Object, Object> {
    @Override
    public Object handle(Object data, ExecuteBean params) {
        log.info("========进入 jsonArrayProcessor 数据处理器============");
        log.info("原始数据:{} ", data);
        log.info("数据处理参数:{} ", params);
//        Object jsonpath = params.getConnectData();
//        if (null != jsonpath && StringUtils.isNotEmpty(jsonpath.toString()) && null != data){
//            data = JsonPathUtil.transfer(data.toString(), (String) jsonpath);
//            log.info("处理后的数据:{} ", data);
//        }
        log.info("========数据处理结束============");
        return data;
    }
}
