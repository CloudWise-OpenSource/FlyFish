package com.cloudwise.lcap.datasource.engineer;

import cn.hutool.core.collection.CollectionUtil;
import cn.hutool.json.JSONObject;
import com.cloudwise.lcap.commonbase.exception.BaseException;
import com.cloudwise.lcap.commonbase.exception.SqlExecException;
import lombok.extern.slf4j.Slf4j;
import org.apache.spark.SparkConf;
import org.apache.spark.api.java.JavaRDD;
import org.apache.spark.api.java.JavaSparkContext;
import org.apache.spark.sql.Dataset;
import org.apache.spark.sql.Row;
import org.apache.spark.sql.SparkSession;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
public class SparkEngineer {

    public static int processors = Runtime.getRuntime().availableProcessors();
    public static SparkConf sparkConf = new SparkConf();

    static {
        sparkConf.set("spark.driver.cores", processors + "")  //设置driver的CPU核数
                .set("spark.driver.maxResultSize", "256M") //设置driver端结果存放的最大容量，这里设置成为20G，超过20G的数据,job就直接放弃，不运行了
                .set("spark.driver.memory", "256M")  //driver给的内存大小
                .set("spark.executor.memory", "512M")// 每个executor的内存
                .set("spark.rpc.message.maxSize", "128")
                .set("spark.sql.shuffle.partitions", "100")
                .set("spark.default.parallelism", "100")
                .set("spark.sql.debug.maxToStringFields", "300")
                .set("spark.debug.maxToStringFields", "300")
                .set("spark.cores.max", processors + "")
                .set("spark.driver.allowMultipleContexts", "true")
                .set("spark.driver.bindAddress", "127.0.0.1")
                .set("spark.eventLog.enabled", "false")
                .set("spark.serializer", "org.apache.spark.serializer.KryoSerializer")
                .set("spark.hadoop.validateOutputSpecs", "false")
                .set("mapreduce.input.fileinputformat.input.dir.recursive", "true")
                .set("spark.local.dir", "logs/spark")
                .set("spark.ui.showConsoleProgress", "false")
                .set("spark.ui.enabled", "false")
                .set("spark.ui.killEnabled", "false")
                //.set("spark.ui.port","4041")
                .set("spark.sql.crossJoin.enabled", "true");
    }

    public static SparkSession sparkSession = SparkSession.builder().appName("lcap").master("local[*]").config(sparkConf).getOrCreate();
    public static JavaSparkContext javaSparkContext = new JavaSparkContext(sparkSession.sparkContext());

    public static List<Map<String, Object>> query(String sql, String tableName, List<JSONObject> fileTableData) {
        List<Map<String, Object>> data = new ArrayList<>();
        if (CollectionUtil.isEmpty(fileTableData)) {
            return data;
        }

        long now = System.currentTimeMillis();
        try {
            //转换为javaRdd
            List<String> tableData = fileTableData.stream().map(JSONObject::toString).collect(Collectors.toList());
            JavaRDD<String> resultRdd = javaSparkContext.parallelize(tableData, processors);
            //先读区文件，得到list<String>，然后用javaSparkContext.parallelize转换为RDD
            //再使用sparkSession读取 JavaRDD
            //将第一行当作表头 //推断数据类型
            Dataset<Row> ds = sparkSession.read().option("header", "false").option("inferSchema", "true").json(resultRdd);
            ds.show(false);
            //3.DataFrame 注册成表
            ds.createOrReplaceTempView(tableName);
            //4.从临时表查询，此时可以执行原生sql，因为原生sql from xxx，需要知道表名才可以
            Dataset<Row> dataset = sparkSession.sql(sql);
            String[] columns = dataset.columns();
            List<Row> rows = dataset.collectAsList();
            rows.forEach(row -> {
                Map<String, Object> object = new LinkedHashMap<>();
                for (String column : columns) {
                    int columnIndex = row.fieldIndex(column);
                    Object value = row.get(columnIndex);
                    object.put(column, SqlParse.getValue(value));
                }
                data.add(object);
            });
            sparkSession.catalog().dropTempView(tableName);
        } catch (Exception e) {
            if (e instanceof BaseException) {
                throw new BaseException(e);
            } else if (e.getCause() instanceof BaseException) {
                throw (BaseException) e.getCause();
            }
            log.error("sql执行失败" + e);
            throw new SqlExecException("sql执行失败 " + e.getMessage());
        }
        log.info("==============数据查询结束,cost time:{}==============", System.currentTimeMillis() - now);
        return data;
    }

}
