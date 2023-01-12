package com.cloudwise.lcap.datasource.combine;

import cn.hutool.core.collection.CollectionUtil;
import cn.hutool.core.map.MapUtil;
import cn.hutool.json.JSONObject;
import com.cloudwise.lcap.commonbase.exception.CombineException;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.ObjectUtils;
import org.apache.commons.lang3.StringUtils;

import java.sql.Timestamp;
import java.util.*;
import java.util.stream.Collectors;

import static com.cloudwise.lcap.commonbase.contants.Constant.*;
import static com.cloudwise.lcap.commonbase.enums.ResultCode.*;

/**
 * 复合数据 复合工具类
 * todo 多值复合-按行合并的字段类型的校验
 */
@Slf4j
public class CombineDataset {

    public static Object combine(Integer queryType, List<List<Map<String,Object>>> dataSets) {
        if (queryType.equals(COMBINE_SINGLE_VALUE_TYPE)) {
            return combineSingleValue(dataSets);
        } else if (queryType.equals(COMBINE_MULTI_VALUE_LINE_TYPE)) {
            return combineMultiValueByLine(dataSets);
        } else if (queryType.equals(COMBINE_MULTI_VALUE_COLUMN_TYPE)) {
            return combineMultiValueByColumn(dataSets);
        } else if (queryType.equals(COMBINE_SEQUENCE_TYPE)) {
            return combineSequentialData(dataSets);
        } else {
            return null;
        }
    }

    public static JSONObject testCombine(String primaryKey, Integer queryType, List<Map<String,Object>> dataSet){
        JSONObject result = new JSONObject();
        result.put("flag",true);
        result.put("msg",null);
        if (queryType.equals(COMBINE_SINGLE_VALUE_TYPE)) {
            if (dataSet.isEmpty() || dataSet.size() > 1){
                result.put("flag",false);
                result.put("msg","数据集有多个字段,不能进行单值复合");
            }
            return result;
        } else if (queryType.equals(COMBINE_MULTI_VALUE_COLUMN_TYPE)) {
            //按列合并
            List<Object> primaryValues = new ArrayList<>();
            for (Map<String, Object> dataLine : dataSet) {
                if (!dataLine.containsKey(primaryKey)) {
                    log.error("数据错误,按列合并的数据:{}不存在主键列:{}", dataLine, primaryKey);
                    result.put("flag",false);
                    result.put("msg","数据错误,按列合并的数据集不存在主键" + primaryKey);
                    return result;
                }
                Object primaryValue = dataLine.get(primaryKey);
                if (ObjectUtils.isEmpty(primaryValue)){
                    primaryValue = "null";
                }
                if (primaryValues.contains(primaryValue)){
                    log.error("按列复合的数据集主键列不唯一,请检查数据");
                    result.put("flag",false);
                    result.put("msg","数据错误,按列复合的数据集主键列不唯一");
                    return result;
                }
                primaryValues.add(primaryValue);
            }
        }
        return result;
    }

    /**
     * 单值复合
     * 特点：多个结果集，每个结果集只能有一条数据，每个数据集只能有一个字段
     * @param dataSets
     */
    public static  List<Map<String, Object>> combineSingleValue(List<List<Map<String,Object>>> dataSets) {
        if (0 == dataSets.size()) {
            return new LinkedList<>();
        }else if (dataSets.size() > 20){
            log.error("单值复合最多支持20个子查询");
            throw new CombineException(COMBINE_QUERY_DATA_VALID_FAILED,"单值复合最多支持20个子查询");
        }
        LinkedList<Map<String, Object>> resultData = new LinkedList<>();
        Map<String, Object> combineData = new LinkedHashMap<>();
        List<Map<String,Object>> dataSet = dataSets.stream().map(o -> o.get(0)).collect(Collectors.toList());
        int i = 1;
        for (Map<String,Object> data : dataSet) {
            //map复制，如果有同名的key则对key按照 key_1 key_2 重命名
            for (String key : data.keySet()) {
                Object value = data.get(key);
                while (combineData.containsKey(key)) {
                    key = key + "_" + i++;
                }
                combineData.put(key, value);
            }
        }
        resultData.add(combineData);
        return resultData;
    }

    /**
     * 多值复合-按行合并：
     * 特点：行叠加,总数据行数=N1+N2+N3...，列名相同的列为同一列。
     */
    public static List<Map<String, Object>> combineMultiValueByLine(List<List<Map<String,Object>>> dataSets) {
        List<Map<String, Object>> resultData = new ArrayList<>();
        if (0 == dataSets.size()) {
            return resultData;
        }else if (dataSets.size() > 10){
            log.error("多值复合最多支持10个子查询");
            throw new CombineException(COMBINE_QUERY_DATA_VALID_FAILED,"多值复合最多支持10个子查询");
        }
        //先记录所有的列名
        //todo 根据列名进行列的数据类型校验
        List<String> fieldNames = new ArrayList<>();
        for (List<Map<String,Object>> dataSet : dataSets) {
            for (Map<String, Object> data : dataSet) {
                data.forEach((k, v) -> {
                    if (!fieldNames.contains(k)) {
                        fieldNames.add(k);
                    }
                });
            }
        }

        for (List<Map<String,Object>> dataSet : dataSets) {
            if (CollectionUtil.isNotEmpty(dataSet)){
                for (Map<String, Object> date : dataSet) {
                    Map<String, Object> sequenceMap = new LinkedHashMap<>();
                    for (String fieldName : fieldNames) {
                        if (date.keySet().contains(fieldName)) {
                            sequenceMap.put(fieldName, date.get(fieldName));
                        } else {
                            sequenceMap.put(fieldName, null);
                        }
                    }
                    resultData.add(sequenceMap);
                }
            }
        }
        return resultData;
    }


    /**
     * 多值复合：按列合并
     * 特点：主键固定（第一列），相同主键的行合并，列名相同的列设置为别名列(别名生成规则,${字段名}_${序号})，列名不相同的列则扩充。
     *
     * [
     *   {
     *       "id":"2"  //此时第二个数据集的id=2的数据不知道合并到哪一行
     *   },
     *   {
     *       "id":"2"
     *   }
     * ]
     */
    public static List<Map<String, Object>> combineMultiValueByColumn(List<List<Map<String,Object>>> dataSets) {
        if (0 == dataSets.size()) {
            return new ArrayList<>();
        }else if (dataSets.size() > MAX_COMBINE_SEQ_TOTAL){
            log.error("多值复合最多支持10个子查询");
            throw new CombineException(COMBINE_QUERY_DATA_VALID_FAILED,"多值复合最多支持10个子查询");
        }
        Map<String, Object> firstLine = dataSets.get(0).get(0);
        //第一个数据集的第一行数据的第一个字段为主键
        String primaryKeyName = firstLine.keySet().toArray(new String[]{})[0];

        //记录每一个数据集的所有列名
        List<String> fieldNames = new ArrayList<>();
        fieldNames.add(primaryKeyName);
        Map<Object, Map<String, Object>> combineData = new LinkedHashMap<>();
        for (List<Map<String,Object>> dataSet : dataSets) {
            parseDataSet(fieldNames, dataSet, primaryKeyName);
            //对数据集的每一行数据进行校验,列名处理
            List<Object> primaryValues = new ArrayList<>();
            for (Map<String, Object> objectMap : dataSet) {
                Object primaryValue = objectMap.get(primaryKeyName);
                if (ObjectUtils.isEmpty(primaryValue)){
                    primaryValue = "null";
                }
                if (primaryValues.contains(primaryValue)){
                    log.error("按列复合的数据集主键列不唯一,请检查数据");
                    throw new CombineException(COMBINE_SEQUENCE_COLUMN_MULTI_PRK,"按列复合的数据集主键列不唯一,请检查数据");
                }
                primaryValues.add(primaryValue);
                if (!combineData.containsKey(primaryValue)){
                    combineData.put(primaryValue, objectMap);
                }else {
                    Map<String, Object> stringObjectMap = combineData.get(primaryValue);
                    objectMap.putAll(stringObjectMap);
                    combineData.put(primaryValue,objectMap);
                }
            }
            //当所有的数据都处理完毕，将该数据集的字段信息保存起来
            //List<String> allFields = getAllFields(dataSet);
            //fieldNames.addAll(allFields);
        }

        List<Map<String, Object>> resultData = new LinkedList<>();
        Collection<Map<String, Object>> dates = combineData.values();
        for (Map<String, Object> date : dates) {
            Map<String, Object> sequenceMap = new LinkedHashMap<>();
            for (String fieldName : fieldNames) {
                if (date.keySet().contains(fieldName)) {
                    sequenceMap.put(fieldName, date.get(fieldName));
                } else {
                    sequenceMap.put(fieldName, null);
                }
            }
            resultData.add(sequenceMap);
        }
        return resultData;
    }

    /**
     * 时序值复合
     */
    public static List<Map<String, Object>> combineSequentialData(List<List<Map<String,Object>>> dataSets) {
        if (0 == dataSets.size()) {
            return new ArrayList<>();
        }else if (dataSets.size() > MAX_COMBINE_SEQ_TOTAL){
            log.error("多值复合最多支持10个子查询");
            throw new CombineException(COMBINE_QUERY_DATA_VALID_FAILED,"多值复合最多支持10个子查询");
        }
        List<Map<String, Object>> resultData = new ArrayList<>();
        for (List<Map<String,Object>> dataSet : dataSets) {
            if (!dataSet.isEmpty()) {
                List<Map<String, Object>> maps = cleanDataSet(dataSet);
                resultData.addAll(maps);
            }
        }
        return resultData;
    }

    /**
     * 时序数据集清洗
     * 对于每一个数据集，时序字段名都可能不一样，需要改成一致的字段名,并将字段值统一处理成时间戳
     *
     * @param dataSet
     * @return
     */
    private static List<Map<String, Object>> cleanDataSet(List<Map<String,Object>> dataSet) {
        List<Map<String, Object>> resultData = new ArrayList<>();
        Map<String, Object> data = dataSet.get(0);
        Map<String, String> sequenceKeyAndType = getSequenceKey(data);
        if (sequenceKeyAndType.isEmpty() || !sequenceKeyAndType.containsKey("sequenceKey")) {
            log.error("数据集异常,时序数据集时序主键异常");
            throw new CombineException(COMBINE_SEQUENCE_COLUMN_ERROR);
        }
        String sequenceKey = sequenceKeyAndType.get("sequenceKey");
        String sequenceKeyType = sequenceKeyAndType.get("sequenceKeyType");
        for (Map<String, Object> data1 : dataSet) {
            //data1 这一行数据的主键转换处理
            Object sequenceValue = data1.get(sequenceKey);
            //对于时间戳类型的无法判定是秒还是毫秒,由数据集提供者自行处理
            if ("datetime".equals(sequenceKeyType)) {
                try {
                    Timestamp timestamp = Timestamp.valueOf(sequenceValue.toString());
                    //Date date = DateUtils.parseDate((String) sequenceValue, parsePatterns);
                    sequenceValue = timestamp.getTime();
                } catch (Exception e) {
                    log.error("时序数据集时序主键值处理异常");
                }
            }
            //data1 这一行数据的其他字段处理
            for (String field : data1.keySet()) {
                if (!field.equals(sequenceKey)) {
                    Map<String, Object> var = new LinkedHashMap<>();
                    var.put("ts", sequenceValue);
                    var.put("type", field);
                    var.put("value", data1.get(field));
                    resultData.add(var);
                }
            }
        }
        return resultData;
    }


    /**
     * 时间格式的处理，还有 ios8601 的格式
     */
    private static String[] parsePatterns = {"yyyy-MM-dd", "yyyy-MM-dd HH:mm", "yyyy-MM-dd HH:mm:ss", "yyyy-MM-dd HH:mm:sss", "yyyy-MM-dd HH:mm:sssz",
            "yyyyMMdd", "yyyy/MM/dd HH:mm", "yyyy/MM/dd HH:mm:ss",
            "yyyy年MM月dd日", "yyyy/MM/dd",};

    /**
     * 时序字段的判定是根据时间工具类判别
     *
     * @param data
     * @return
     */
    public static Map<String, String> getSequenceKey(Map<String, Object> data) {
        Map<String, String> sequenceKeyAndType = new HashMap<>();
        for (String field : data.keySet()) {
            Object value = data.get(field);
            //时间戳秒值最小是7位，并且不能是 002353485796 这样的结构
            if (value.toString().matches("[0-9]+") && value.toString().length() >= 7 && !"0".equals(value.toString().substring(0, 1))) {
                try {
                    long unixtimestamp = Long.parseLong(value.toString());
                    sequenceKeyAndType.put("sequenceKeyType", "timestamp");
                    sequenceKeyAndType.put("sequenceKey", field);
                    return sequenceKeyAndType;
                } catch (NumberFormatException e) {
                    //否则继续向下进行转换测试
                }
            } else {
                try {
                    Timestamp.valueOf(value.toString());
                    //DateUtils.parseDate((String) value, parsePatterns);
                    sequenceKeyAndType.put("sequenceKeyType", "datetime");
                    sequenceKeyAndType.put("sequenceKey", field);
                    return sequenceKeyAndType;
                } catch (Exception e) {
                }
            }

        }
        return sequenceKeyAndType;
    }

    private static List<String> getAllFields(List<Map<String,Object>> sourceMap) {
        List<String> fieldNames = new ArrayList<>();
        for (Map<String, Object> stringObjectMap : sourceMap) {
            if (MapUtil.isNotEmpty(stringObjectMap)) {
                fieldNames.addAll(stringObjectMap.keySet());
            }
        }
        Set<String> arraySet = new HashSet<>(fieldNames);
        return new ArrayList<>(arraySet);
    }

    /**
     * 多值-按列复合。
     * 判断当前 dataset 中是否有重复的字段，如果有重复的字段则重命名
     * 需要注意排除主键
     *
     * @param fields  历史数据集的列名(注意相同数据集的不同行的数据,列名不算重复)
     * @param dataSet 数据集
     * @return
     */
    private static void parseDataSet(List<String> fields, List<Map<String,Object>> dataSet, String primaryKeyName) {
        //当前数据集的列名
        List<String> currentDatasetFields = getAllFields(dataSet);

        Map<String, String> replaceField = new HashMap<>();
        for (String field : currentDatasetFields) {
            if (!StringUtils.equals(primaryKeyName, field)) {
                String oldField = field;
                int i = 1;
                while (fields.contains(field)) {
                    //field 已经被包含，需要重命名
                    field = oldField + "_" + i++;
                }
                fields.add(field);
                if (!StringUtils.equals(oldField, field)) {
                    //字段名被替换,需要到数据中进行真正的数据集的字段替换
                    replaceField.put(oldField, field);
                }
            }
        }
        for (Map<String, Object> objectMap : dataSet) {
            //主键校验,必须有主键列，如果已经有该行数据，则合并行
            if (!objectMap.containsKey(primaryKeyName)) {
                log.error("数据错误,按列合并的数据:{}不存在主键列:{}", objectMap, primaryKeyName);
                throw new CombineException(COMBINE_MULTI_VALUE_COLUMN_ERROR);
            }
            replaceField.forEach((oldField, newField) -> {
                objectMap.put(newField, objectMap.remove(oldField));
            });
        }
    }
}
