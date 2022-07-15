package com.cloudwise.lcap.test.framework.parse;

import com.google.common.collect.HashBasedTable;
import com.google.common.collect.Table;
import org.apache.calcite.config.Lex;
import org.apache.calcite.sql.*;
import org.apache.calcite.sql.parser.SqlParser;
import org.apache.calcite.sql.validate.SqlConformanceEnum;

import java.util.*;

/**
 * sql解析，首先sql解析为sqlnode，sqlNode其实就是AST语法树,从中分析出字段，库名 表名，join，where，group Order等条件
 *
 * 基于sql语句使用 Planner 分析、校验后得到 RelNode。并且测试了对where filed=xxx 条件查询语句包含中文时的乱码解决方案
 * 解决方式就是在创建 schema时指定SqlDialect，并且这里直接重写了 mysqlSqlDialect 的 quoteStringLiteral 方法。
 * 此外，在 FrameworkConfig 中还加入了自定义算子。
 */
public class ParseTest1 {
    public static void main(String[] args) throws Exception {
        String sql = "select s.id,s.name,s.age as age1,c.classname,c.classId FROM db.stu s join db.class c where s.age<20";
        SqlParser.Config config = SqlParser.configBuilder().setLex(Lex.MYSQL).setCaseSensitive(true).setConformance(SqlConformanceEnum.DEFAULT).build();
        SqlParser sqlParser = SqlParser.create(sql, config);
        try {
            SqlNode sqlNode = sqlParser.parseQuery();
            //guava提供的table结构, rowkey:column:value rowkey=字段名/表名 column=代表类型为field或table，value=字段或表的别名（用as设置的别名）
            Table<String, String, String> fieldMap = HashBasedTable.create();
            handlerSQL(sqlNode, fieldMap);

            System.out.println(" " + fieldMap);
            Map<String, Map<String, String>> stringMapMap = fieldMap.rowMap();
            Set<String> strings = stringMapMap.keySet();
            for (String string : strings) {
                Map<String, String> map = stringMapMap.get(string);
                System.out.println("rowKey:" + string + ",key:" + map.keySet() + ",value:" + map.values());
            }
        } catch (Exception e) {
            throw new RuntimeException("", e);
        }
    }

    private static void handlerSQL(SqlNode sqlNode, Table<String, String, String> fieldMap) {
        SqlKind kind = sqlNode.getKind();
        switch (kind) {
            case SELECT:
                SqlSelect sqlSelect = (SqlSelect) sqlNode;
                SqlNodeList selectList = sqlSelect.getSelectList();
                selectList.getList().forEach(node -> handlerField(node, fieldMap));
                SqlNode from = sqlSelect.getFrom();
                if (null != from) {
                    handlerFrom(from, fieldMap);
                }
                if (sqlSelect.hasWhere()) {
                    handlerField(sqlSelect.getWhere(), fieldMap);
                }
                if (sqlSelect.hasOrderBy()) {
                    handlerField(sqlSelect.getOrderList(), fieldMap);
                }
                SqlNodeList group = sqlSelect.getGroup();
                if (group != null) {
                    group.forEach(node -> handlerField(node, fieldMap));
                }
                SqlNode fetch = sqlSelect.getFetch();
                if (fetch != null) {
                    //TODO limit
                }
                break;
            case UNION:
                ((SqlBasicCall) sqlNode).getOperandList().forEach(node -> handlerSQL(node, fieldMap));
                break;
            case ORDER_BY:
                SqlOrderBy sqlOrderBy = (SqlOrderBy) sqlNode;
                SqlNode query = sqlOrderBy.query;
                handlerSQL(query, fieldMap);
                SqlNodeList orderList = sqlOrderBy.orderList;
                handlerField(orderList, fieldMap);
                break;
            case AS:
                SqlBasicCall sqlBasicCall = (SqlBasicCall) sqlNode;
                SqlNode left_as = sqlBasicCall.getOperandList().get(0);
                SqlNode right_as = sqlBasicCall.getOperandList().get(1);
                System.out.println("as " + left_as.toString() + "," + right_as.toString());
                fieldMap.put(left_as.toString(), "table", right_as.toString());
                break;
            case IDENTIFIER:
                SqlIdentifier sqlIdentifier = (SqlIdentifier) sqlNode;
                //TODO 表名的替换，所以在此之前就需要获取到模型的信息
                System.out.println("==tablename===" + sqlIdentifier.toString());
                fieldMap.put(sqlIdentifier.toString(), "table", sqlIdentifier.toString());
                break;
        }
    }


    private static void handlerFrom(SqlNode from, Table<String, String, String> fieldMap) {
        SqlKind kind = from.getKind();
        switch (kind) {
            case IDENTIFIER:
                //最终的表名
                SqlIdentifier sqlIdentifier = (SqlIdentifier) from;
                //TODO 表名的替换，所以在此之前就需要获取到模型的信息
                System.out.println("==tablename===" + sqlIdentifier.toString());
                fieldMap.put(sqlIdentifier.toString(), "table", sqlIdentifier.toString());
                break;
            case AS:
                SqlBasicCall sqlBasicCall = (SqlBasicCall) from;
                SqlNode selectNode = sqlBasicCall.getOperandList().get(0);
                SqlNode selectNode1 = sqlBasicCall.getOperandList().get(1);
                fieldMap.put(selectNode.toString(), "table", selectNode1.toString());
                //handlerSQL(selectNode,fieldMap);
                break;
            case JOIN:
                SqlJoin sqlJoin = (SqlJoin) from;
                SqlNode left = sqlJoin.getLeft();
                handlerSQL(left, fieldMap);
                SqlNode right = sqlJoin.getRight();
                handlerSQL(right, fieldMap);
                SqlNode condition = sqlJoin.getCondition();
                handlerField(condition, fieldMap);
                break;
            case SELECT:
                handlerSQL(from, fieldMap);
                break;
        }
    }

    private static void handlerField(SqlNode field, Table<String, String, String> fieldMap) {
        if (null != field) {
            SqlKind kind = field.getKind();
            switch (kind) {
                case AS:
                    List<SqlNode> operands_as = ((SqlBasicCall) field).getOperandList();
                    SqlNode left_as = operands_as.get(0);
                    SqlNode right_as = operands_as.get(1);
                    fieldMap.put(left_as.toString(), "field", right_as.toString());
                    //handlerField(left_as,fieldMap);
                    break;
                case IDENTIFIER:
                    //表⽰当前为⼦节点
                    SqlIdentifier sqlIdentifier = (SqlIdentifier) field;
                    System.out.println("===field===" + sqlIdentifier.toString());
                    fieldMap.put(sqlIdentifier.toString(), "field", sqlIdentifier.toString());
                    break;
                default:
                    if (field instanceof SqlBasicCall) {
                        List<SqlNode> nodes = ((SqlBasicCall) field).getOperandList();
                        for (int i = 0; i < nodes.size(); i++) {
                            handlerField(nodes.get(i), fieldMap);
                        }
                    }
                    if (field instanceof SqlNodeList) {
                        ((SqlNodeList) field).getList().forEach(node -> {
                            handlerField(node, fieldMap);
                        });
                    }
                    break;
            }
        }
    }

}
