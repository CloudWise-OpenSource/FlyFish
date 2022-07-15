package com.cloudwise.lcap.common.utils;

import com.jayway.jsonpath.*;
import com.jayway.jsonpath.spi.json.JsonSmartJsonProvider;
import lombok.extern.slf4j.Slf4j;
import net.minidev.json.JSONArray;

import java.util.Map;

import static com.jayway.jsonpath.Criteria.where;
import static com.jayway.jsonpath.Option.DEFAULT_PATH_LEAF_TO_NULL;

/**
 *     推荐一个jsonpath的测试网址：http://jsonpath.com/
 */
@Slf4j
public class JsonPathUtil {
    //JsonPath中的“根成员对象”始终称为$，无论是对象还是数组
    private static final String ROOT_PREFIX = "$";

    private static Configuration configuration;

    static {
        configuration = Configuration.builder().options(
                DEFAULT_PATH_LEAF_TO_NULL,
                DEFAULT_PATH_LEAF_TO_NULL, // 如果路径不存在则返回null,而不要抛出PathNotFoundException
                Option.SUPPRESS_EXCEPTIONS // 抑制异常的抛出，当设置了Option.ALWAYS_RETURN_LIST时返回[],否则返回null
        ).jsonProvider(new JsonSmartJsonProvider()).build();
    }

    /**
     * jsonpath 转换、过滤、提取
     * @param documentStr 转换为string类型后的数据
     * @param pattern jsonpath模式
     * @return {@link net.minidev.json.JSONArray}
     * 即使其中某一个字段为null或者空字符串，也会占用一个位置
     */
    public static Object transfer(String documentStr,String pattern){
        DocumentContext context = JsonPath.parse(documentStr, configuration);
        Object read = context.read(pattern);
        return read;
    }

    public static String setValue(String documentStr,String pattern,String value){
        DocumentContext context = JsonPath.parse(documentStr, configuration);
        DocumentContext context1 = context.set(pattern, value);
        return  context1.jsonString();
    }

    public static String setValues(String documentStr,Map<String,Object> patternAndValues){
        DocumentContext context = JsonPath.parse(documentStr, configuration);
        patternAndValues.forEach((k,v)->{
            context.set(k, v);
        });

        return  context.jsonString();
    }


    public static void main(String[] args) {
        listResponse();
        objectResponse();
    }


    public static void objectResponse(){
        String documentStr = getObjectRespJson();

        /*1.此处预先解析json,默认请情下JsonPath.read方法每掉一次都会重新解析json*/
        DocumentContext context = JsonPath.parse(documentStr, configuration);
        //data 是对象,[?]没指定取哪个字段，所以需要filter过滤
        Object val = context.read("$.data[?]", Filter.filter(where("price").lt(500)));
        System.out.println("val:"+val);
        //data.color 指定了具体的字段,所以不再需要filter过滤
        Object val1 = context.read("$.data.color");
        //val1是string
        System.out.println("val1:"+val1);
        //取整个对象
        Object val2 = context.read("$.data");
        System.out.println("val2:"+val2);

        //修改值
        DocumentContext blue = context.set("$.data.color", "blue");
        System.out.println("blue:"+blue);

        //string解析成json树
        Object document = configuration.jsonProvider().parse(documentStr);
        //将path应用于json树 也可以加一些过滤条件
        //官网地址,可查询过滤器定义功能等 https://www.baeldung.com/guide-to-jayway-jsonpath
        //https://www.liangzl.com/get-article-detail-148863.html

        // 用法3。当在java中使用JsonPath时，重要的是要知道你在结果中期望什么类型。 JsonPath将自动尝试将结果转换为调用者预期的类型。
        // 抛出 java.lang.ClassCastException 异常
        // List<String> list = JsonPath.parse(json).read("$.data.book[0].author");
        // 正常
        // String author = JsonPath.parse(json).read("$.data.book[0].author");

        // 用法4：默认情况下，MappingProvider SPI提供了一个简单的对象映射器。 这允许您指定所需的返回类型，MappingProvider将尝试执行映射。 在下面的示例中，演示了Long和Date之间的映射。
        //String json = "{\"date_as_long\" : 1411455611975}";
        //Date date = JsonPath.parse(json).read("$['date_as_long']", Date.class);
    }


    public static void listResponse(){
        String documentStr = getListRespJson();

        /*1.此处预先解析json,默认请情下JsonPath.read方法每掉一次都会重新解析json*/
        DocumentContext context = JsonPath.parse(documentStr, configuration);


        // //*通配符  ?过滤器表达式 ,Filter.filter(where("@.category").is("reference"))
        Object val3 = context.read("$.data[?(@.category=='reference')]");
        System.out.println("val3:"+val3);
        Object val4 = context.read("$.data[?]",Filter.filter(where("category").is("reference")));
        System.out.println("val4:"+val4);
        Object val5 = context.read("$..data[*].author");
        System.out.println("val5:"+val5);
        JSONArray array = (JSONArray) val5;
        Object[] objects = array.toArray(new Object[]{});

        //string解析成json树
        Object document = configuration.jsonProvider().parse(documentStr);
        //将path应用于json树 也可以加一些过滤条件
        //官网地址,可查询过滤器定义功能等 https://www.baeldung.com/guide-to-jayway-jsonpath
        //https://www.liangzl.com/get-article-detail-148863.html
        //data是列表,boot[0]代表取第一个数据，索引从0开始
        Object val6 = JsonPath.read(document, "$.data[0]");
        System.out.println("val6:"+val6);
        Object val7 = JsonPath.read(document,"$.data[?(@.category=='reference')]");
        System.out.println("val7:"+val7);
        //取data的第一个对象的author字段
        String author0 = JsonPath.read(document, "$.data[0].author");
        System.out.println("author0:"+author0);

        // 用法3。当在java中使用JsonPath时，重要的是要知道你在结果中期望什么类型。 JsonPath将自动尝试将结果转换为调用者预期的类型。
        // 抛出 java.lang.ClassCastException 异常
        // List<String> list = JsonPath.parse(json).read("$.data[0].author");
        // 正常
        // String author = JsonPath.parse(json).read("$.data[0].author");

        // 用法4：默认情况下，MappingProvider SPI提供了一个简单的对象映射器。 这允许您指定所需的返回类型，MappingProvider将尝试执行映射。 在下面的示例中，演示了Long和Date之间的映射。
        //String json = "{\"date_as_long\" : 1411455611975}";
        //Date date = JsonPath.parse(json).read("$['date_as_long']", Date.class);

        // (5)
        // 如果您将JsonPath配置为使用JacksonMappingProvider或GsonMappingProvider，您甚至可以将JsonPath输出直接映射到POJO中。
        //Book book = JsonPath.parse(json).read("$.data[0]", Book.class);
    }

    private static String getListRespJson(){
        return  "{ \"data\": [ \n" +
                "      { \"category\": \"reference\",\n" +
                "        \"author\": null,\n" +
                "        \"title\": \"Sayings of the Century\",\n" +
                "        \"price\": 8.95\n" +
                "      },\n" +
                "      { \"category\": \"fiction\",\n" +
                "        \"author\": \"Evelyn Waugh\",\n" +
                "        \"title\": \"Sword of Honour\",\n" +
                "        \"price\": 12.99\n" +
                "      },\n" +
                "      { \"category\": \"fiction\",\n" +
                "        \"author\": \"Herman Melville\",\n" +
                "        \"title\": \"Moby Dick\",\n" +
                "        \"isbn\": \"0-553-21311-3\",\n" +
                "        \"price\": 8.99\n" +
                "      },\n" +
                "      { \"category\": \"fiction\",\n" +
                "        \"author\": \"\",\n" +
                "        \"title\": \"The Lord of the Rings\",\n" +
                "        \"isbn\": \"0-395-19395-8\",\n" +
                "        \"price\": 22.99\n" +
                "      }\n" +
                "    ]\n" +
                "}";
    }


    private static String getObjectRespJson(){
        return  "{ \"data\":{\n" +
                "      \"color\": \"red\",\n" +
                "      \"price\": 19.95\n" +
                "    }\n" +
                "}";
    }

}
