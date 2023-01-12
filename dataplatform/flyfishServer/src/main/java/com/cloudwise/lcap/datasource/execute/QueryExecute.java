package com.cloudwise.lcap.datasource.execute;

import cn.hutool.core.thread.ThreadFactoryBuilder;
import com.cloudwise.lcap.commonbase.exception.BaseException;
import com.cloudwise.lcap.commonbase.exception.ParameterException;
import com.cloudwise.lcap.commonbase.exception.SqlExecException;
import com.cloudwise.lcap.commonbase.util.Snowflake;
import com.cloudwise.lcap.datasource.model.ExecuteBean;
import com.cloudwise.lcap.datasource.model.QueryResult;
import com.cloudwise.lcap.datasource.query.HttpQueryProxy;
import com.cloudwise.lcap.datasource.query.JDBCQueryProxy;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.*;

import static com.cloudwise.lcap.commonbase.contants.Constant.*;
import static com.cloudwise.lcap.commonbase.enums.ResultCode.QUERY_EXECUTE_FAILED;


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
    static ExecutorService executorService = new ThreadPoolExecutor(processors, 4 * processors - 1, 5, TimeUnit.MINUTES, new ArrayBlockingQueue<>(100), new ThreadFactoryBuilder().setNamePrefix("BusinessExecute").build());
    static ConcurrentHashMap<Long, FutureTask<QueryResult>> resultCache = new ConcurrentHashMap<>();


    @Value("${datasource.maxconnect}")
    private int maxConnect;
    /**
     * 数据查询步骤
     *
     * @param params 参数
     * @return
     * @throws Exception
     */
    public List<Map<String,Object>> execute(ExecuteBean params) {
        return executeAsync(params,maxConnect);
    }

    public List<Map<String,Object>> executeAsync(ExecuteBean params,int maxConnect) {
        Long taskId = Snowflake.INSTANCE.nextId();
        params.setTaskId(taskId);
        String schemaType = params.getSchemaType();
        if(StringUtils.isBlank(schemaType)){
            log.error("参数schemaType缺失");
            throw new ParameterException("参数schemaType缺失");
        }
        FutureTask<QueryResult> task = null;
        switch (params.getSchemaType().toLowerCase()) {
            case MYSQL:
            case POSTGRES:
            case SQL_SERVER:
            case ORACLE:
            case DAMENG:
            case MARIA:
            case CLICKHOUSE:
                task = new FutureTask<>(() -> JDBCQueryProxy.query(params,schemaType,maxConnect));
                break;
            case HTTP:
                Map<String,Object> extraHeader = new HashMap<>();
                task = new FutureTask<>(() -> HttpQueryProxy.query(params,extraHeader));
                break;
            default:
                break;
        }
        executorService.submit(task);
        //加到最后,任务按加入顺序排优先级执行
        resultCache.put(taskId, task);
        
        return getResult(taskId);
    }


    private static List<Map<String,Object>> getResult(Long taskId) {
        while (!resultCache.isEmpty()) {
            synchronized (QueryExecute.class) {
                //这里只是出栈入栈操作,非耗时操作,并发时会导致 taskQueue.poll()= null
                FutureTask<QueryResult> futureTask = resultCache.get(taskId);
                if (null == futureTask) {
                    log.error("查询数据异常,查询超时或数据集已漂移");
                    throw new SqlExecException(QUERY_EXECUTE_FAILED);
                }
                if (futureTask.isDone()) {
                    QueryResult result = null;
                    try {
                        result = futureTask.get();
                        if (result.getTaskId().equals(taskId)) {
                            resultCache.remove(taskId);
                            //已经完成的任务调用get()方法获取结果
                            return result.getData();
                        }
                    } catch (Exception e) {
                        String errorMsg = e.toString();
                        if (e instanceof BaseException || e.getCause() instanceof BaseException) {
                            throw new BaseException(e);
                        }
                        log.error("QueryExecute.execute查询数据异常 " + errorMsg,e);
                        throw new SqlExecException(QUERY_EXECUTE_FAILED);
                    }
                }
            }
        }
        return null;
    }

}
