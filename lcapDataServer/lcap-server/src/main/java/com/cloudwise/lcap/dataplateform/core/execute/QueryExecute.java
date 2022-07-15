package com.cloudwise.lcap.dataplateform.core.execute;

import cn.hutool.core.thread.ThreadFactoryBuilder;
import cn.hutool.json.JSONObject;
import com.cloudwise.lcap.common.exception.BaseException;
import com.cloudwise.lcap.common.exception.ParameterException;
import com.cloudwise.lcap.common.exception.SqlExecException;
import com.cloudwise.lcap.dataplateform.core.model.ExecuteBean;
import com.cloudwise.lcap.dataplateform.core.query.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.*;

import static com.cloudwise.lcap.common.contants.Constant.*;
import static com.cloudwise.lcap.common.enums.ResultCode.QUERY_EXECUTE_FAILED;


/**
 * 业务接口执行器
 *
 * @author zhaobo
 * @date 2022/1/13
 */
@Service("queryExecute")
@Slf4j
public class QueryExecute {


    static int processors = Runtime.getRuntime().availableProcessors();
    static  ExecutorService executorService = new ThreadPoolExecutor(processors, 4 * processors - 1, 5,TimeUnit.MINUTES, new ArrayBlockingQueue<>(100), new ThreadFactoryBuilder().setNamePrefix("BusinessExecute").build());


    static ConcurrentHashMap<Long, FutureTask<Map<String,Object>>> resultCache = new ConcurrentHashMap<>();

    /**
     * 数据查询步骤
     *
     * @param params   参数
     * @return
     * @throws Exception
     */
    public static List<Map<String,Object>> execute(ExecuteBean params) {
        Long taskId = params.getTaskId();
        if (null == taskId) {
            log.error("参数taskId缺失");
            throw new ParameterException("参数taskId缺失");
        }
        String schemaType = params.getSchemaType();
        FutureTask<Map<String,Object>> task = null;
        switch (schemaType.toLowerCase()){
            case MYSQL:
                task = new FutureTask<>(() -> MySqlQueryProxy.query(params));
                break;
            case HTTP:
                task = new FutureTask<>(() -> HttpQueryProxy.query(params));
                break;
            default:
                break;
        }

        executorService.submit(task);
        //加到最后,任务按加入顺序排优先级执行
        //taskQueue.addLast(task);
        resultCache.put(taskId,task);

        Map<String,Object>  result = getResult2(taskId);
        List<Map<String, Object>> execute = (List<Map<String, Object>>) result.get("data");

        List<Map<String,Object>> data = new ArrayList<>();
        for (Map<String, Object> stringObjectMap : execute) {
            Map<String,Object> exchange = new HashMap<>();
            exchange.putAll(stringObjectMap);
            data.add(exchange);
        }

        return data;
    }



    private static Map<String,Object>  getResult2(Long taskId) {
        while (!resultCache.isEmpty()) {
            synchronized (QueryExecute.class) {
                //这里只是出栈入栈操作,非耗时操作,并发时会导致 taskQueue.poll()= null
                FutureTask<Map<String,Object>> futureTask = resultCache.get(taskId);
                if (null == futureTask) {
                    log.error("查询数据异常,查询超时或数据集已漂移");
                    throw new SqlExecException(QUERY_EXECUTE_FAILED);
                }
                if (futureTask.isDone()) {
                    Map<String,Object> result = null;
                    try {
                        result = futureTask.get();
                        Long taskId1 = Long.valueOf(result.get("taskId").toString());
                        if (taskId1.equals(taskId)) {
                            resultCache.remove(taskId);
                            //已经完成的任务调用get()方法获取结果
                            return result;
                        }
                    } catch (Exception e) {
                        String errorMsg = e.toString();
                        if (e instanceof BaseException || e.getCause() instanceof BaseException) {
                            throw new BaseException(e);
                        }
                        log.error("QueryExecute.execute查询数据异常 " + errorMsg);
                        throw new SqlExecException(QUERY_EXECUTE_FAILED);
                    }

                }
            }
        }
        return null;
    }

}
