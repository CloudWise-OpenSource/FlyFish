package com.cloudwise.lcap.test.framework.parse;

import lombok.extern.slf4j.Slf4j;
import org.apache.calcite.config.Lex;
import org.apache.calcite.sql.*;
import org.apache.calcite.sql.parser.SqlParseException;
import org.apache.calcite.sql.parser.SqlParser;

import java.util.*;

/**
 * sql解析，首先sql解析为sqlnode，sqlNode其实就是AST语法树,从中分析出字段，库名 表名，join，where，group Order等条件
 *
 * 基于sql语句使用 Planner 分析、校验后得到 RelNode。并且测试了对where filed=xxx 条件查询语句包含中文时的乱码解决方案
 * 解决方式就是在创建 schema时指定SqlDialect，并且这里直接重写了 mysqlSqlDialect 的 quoteStringLiteral 方法。
 * 此外，在 FrameworkConfig 中还加入了自定义算子。
 */
@Slf4j
public class ParseTest2 {

    public static void main(String[] args) throws Exception {
        String sql = "select s.id,s.name,s.age as age1,class.classname,class.classId FROM db.stu s join db.class  where s.age<20";
        String sql0 = "SELECT MIN(relation_id) FROM tableA JOIN TableB  GROUP BY account_instance_id, follow_account_instance_id HAVING COUNT(*)>1";
        String sql1 = "SELECT * FROM blog_user_relation a WHERE (a.account_instance_id,a.follow_account_instance_id) IN (SELECT account_instance_id,follow_account_instance_id FROM Blogs_info GROUP BY account_instance_id, follow_account_instance_id HAVING COUNT(*) > 1)";
        String sql2 = "select name from (select * from student)";
        String sql3 = "SELECT * FROM Student LEFT JOIN Grade ON Student.sID = Grade.gID UNION SELECT * FROM Student RIGHT JOIN Grade ON Student.sID = Grade.gID";
        String sql4 = "SELECT * FROM teacher WHERE birth = (SELECT MIN(birth) FROM employee)";
        String sql5 = "SELECT sName FROM Student WHERE 450 NOT IN (SELECT courseID  FROM Course  WHERE sID = Student.sID)";
        SqlNode sqlNode0 = parseSql(sql);
        //Set<String> tables = extractSourceTableInSelectSql(sqlNode0, false);
        Map<String, String> tables = extractSourceTableInSelectSql2(sqlNode0, false);
        System.out.println("sqlNode0: " + tables);
    }


    /**
     * 解析sql，sql语句中的表名，字段名，where条件，having条件，group条件等
     * 一个select语句包含from部分、where部分、select部分等，每一部分都表示一个SqlNode。
     * SqlKind是一个枚举类型，包含了各种SqlNode类型：SqlSelect、SqlIdentifier、SqlLiteral等。
     * SqlIdentifier表示标识符，例如表名称、字段名；
     * SqlLiteral表示字面常量，一些具体的数字、字符。
     * https://blog.csdn.net/u011250186/article/details/106856572
     */
    public static SqlNode parseSql(String sql) throws SqlParseException {
        SqlParser.Config sqlParserConfig = SqlParser.config().withLex(Lex.JAVA).withCaseSensitive(true);
        //sqlnode生成方式1
        SqlParser sqlParser = SqlParser.create(sql, sqlParserConfig);
        SqlNode sqlNode = sqlParser.parseStmt();

//        ListSqlOperatorTable listSqlOperatorTable = new ListSqlOperatorTable();
//        listSqlOperatorTable.getOperatorList().addAll(SqlStdOperatorTable.instance().getOperatorList());
//        FrameworkConfig frameworkConfig = Frameworks.newConfigBuilder()
//                .defaultSchema(CalciteSchema.createRootSchema(false, false).plus())
//                .parserConfig(sqlParserConfig)
//                .sqlValidatorConfig(SqlValidator.Config.DEFAULT.withIdentifierExpansion(true))
//                .operatorTable(listSqlOperatorTable)
//                .traitDefs(ConventionTraitDef.INSTANCE, RelDistributionTraitDef.INSTANCE).build();
//
//        //sqlnode生成方式2
//        Planner planner = Frameworks.getPlanner(frameworkConfig);
//        SqlNode sqlNode1 =  planner.parse(sql);
        return sqlNode;

    }

    /**
     * 解析Select中的表名
     *
     * @param sqlNode
     * @param fromOrJoin
     * @return
     */
    private static Set<String> extractSourceTableInSelectSql(SqlNode sqlNode, boolean fromOrJoin) {
        if (sqlNode == null) {
            return new HashSet<>();
        }
        final SqlKind sqlKind = sqlNode.getKind();
        if (SqlKind.SELECT.equals(sqlKind)) {
            SqlSelect selectNode = (SqlSelect) sqlNode;
            Set<String> strings = extractSourceTableInSelectSql(selectNode.getFrom(), true);
            Set<String> selectList = new HashSet<>(strings);
            selectNode.getSelectList().getList().stream().filter(node -> node instanceof SqlCall)
                    .forEach(node -> selectList.addAll(extractSourceTableInSelectSql(node, false)));
            selectList.addAll(extractSourceTableInSelectSql(selectNode.getWhere(), false));
            selectList.addAll(extractSourceTableInSelectSql(selectNode.getHaving(), false));
            return selectList;
        }
        if (SqlKind.JOIN.equals(sqlKind)) {
            SqlJoin sqlJoin = (SqlJoin) sqlNode;
            Set<String> joinList = new HashSet<>();
            joinList.addAll(extractSourceTableInSelectSql(sqlJoin.getLeft(), true));
            joinList.addAll(extractSourceTableInSelectSql(sqlJoin.getRight(), true));
            return joinList;
        }

        if (SqlKind.AS.equals(sqlKind)) {
            SqlCall sqlCall = (SqlCall) sqlNode;
            return extractSourceTableInSelectSql(sqlCall.getOperandList().get(0), fromOrJoin);
        }
        if (SqlKind.IDENTIFIER.equals(sqlKind)) {
            Set<String> identifierList = new HashSet<>();
            if (fromOrJoin) {
                SqlIdentifier sqlIdentifier = (SqlIdentifier) sqlNode;
                identifierList.add(sqlIdentifier.toString());
            }
            return identifierList;
        }
        Set<String> defaultList = new HashSet<>();
        if (sqlNode instanceof SqlCall) {
            SqlCall call = (SqlCall) sqlNode;
            call.getOperandList().forEach(node -> defaultList.addAll(extractSourceTableInSelectSql(node, false)));
        }
        return defaultList;
    }

    private static Map<String, String> extractSourceTableInSelectSql2(SqlNode sqlNode, boolean fromOrJoin) {
        if (sqlNode == null) {
            return new HashMap<>();
        }
        final SqlKind sqlKind = sqlNode.getKind();
        if (SqlKind.SELECT.equals(sqlKind)) {
            SqlSelect selectNode = (SqlSelect) sqlNode;
            Map<String, String> map = extractSourceTableInSelectSql2(selectNode.getFrom(), true);
            Map<String, String> selectList = new HashMap<>();
            selectList.putAll(map);
            selectNode.getSelectList().getList().stream().filter(node -> node instanceof SqlCall)
                    .forEach(node -> selectList.putAll(extractSourceTableInSelectSql2(node, false)));
            selectList.putAll(extractSourceTableInSelectSql2(selectNode.getWhere(), false));
            selectList.putAll(extractSourceTableInSelectSql2(selectNode.getHaving(), false));
            return selectList;
        }
        if (SqlKind.JOIN.equals(sqlKind)) {
            SqlJoin sqlJoin = (SqlJoin) sqlNode;
            Map<String, String> selectList = new HashMap<>();
            selectList.putAll(extractSourceTableInSelectSql2(sqlJoin.getLeft(), true));
            selectList.putAll(extractSourceTableInSelectSql2(sqlJoin.getRight(), true));
            return selectList;
        }

        //此时可以把字段别名过滤掉
        if (SqlKind.AS.equals(sqlKind) && fromOrJoin) {
            SqlCall sqlCall = (SqlCall) sqlNode;
            Map<String, String> defaultList = new HashMap<>();
            SqlNode sqlNode1 = sqlCall.getOperandList().get(0);
            SqlNode sqlNode2 = sqlCall.getOperandList().get(1);
            defaultList.put(sqlNode2.toString(), sqlNode1.toString());
            return defaultList;
            //return extractSourceTableInSelectSql2(sqlNode1, fromOrJoin);
        }
        if (SqlKind.IDENTIFIER.equals(sqlKind)) {
            Map<String, String> identifierList = new HashMap<>();
            if (fromOrJoin) {
                SqlIdentifier sqlIdentifier = (SqlIdentifier) sqlNode;
                identifierList.put(sqlIdentifier.toString(), sqlIdentifier.toString());
            }
            return identifierList;
        }
        Map<String, String> defaultList = new HashMap<>();
        if (sqlNode instanceof SqlCall) {
            SqlCall call = (SqlCall) sqlNode;
            call.getOperandList().forEach(node -> defaultList.putAll(extractSourceTableInSelectSql2(node, false)));
        }
        return defaultList;
    }

    /**
     * 解析Insert语句中的表名
     *
     * @param sqlNode
     * @param fromOrJoin
     * @return
     */
    private static Set<String> extractSourceTableInInsertSql(SqlNode sqlNode, boolean fromOrJoin) {
        SqlInsert sqlInsert = (SqlInsert) sqlNode;
        Set<String> insertList = new HashSet<>(extractSourceTableInSelectSql(sqlInsert.getSource(), false));
        final SqlNode targetTable = sqlInsert.getTargetTable();
        if (targetTable instanceof SqlIdentifier) {
            insertList.add(targetTable.toString());
        }
        return insertList;
    }

    private static void parseSqlNode(SqlNode sqlNode) {
        if (SqlKind.SELECT.equals(sqlNode.getKind())) {
            SqlSelect sqlSelect = (SqlSelect) sqlNode;
            SqlNode from = sqlSelect.getFrom();
            SqlNode where = sqlSelect.getWhere();
            SqlKind kind = sqlSelect.getKind();
            SqlNodeList orderList = sqlSelect.getOrderList();
            SqlNode having = sqlSelect.getHaving();
            SqlNode offset = sqlSelect.getOffset();
            SqlNodeList group = sqlSelect.getGroup();
            SqlNode fetch = sqlSelect.getFetch();
            SqlLiteral functionQuantifier = sqlSelect.getFunctionQuantifier();
            List<SqlNode> operandList = sqlSelect.getOperandList();
            SqlNodeList selectList = sqlSelect.getSelectList();

            if (null != where) {
                System.out.println("where子句:" + where.toString());
                if (SqlKind.LESS_THAN.equals(where.getKind())) {
                    SqlBasicCall sqlBasicCall = (SqlBasicCall) where;
                    for (SqlNode sqlNode1 : sqlBasicCall.getOperandList()) {
                        if (SqlKind.IDENTIFIER.equals(sqlNode1.getKind())) {
                            System.out.println("where子句 左子句:" + sqlNode1.toString());
                        } else if (SqlKind.LITERAL.equals(sqlNode1.getKind())) {
                            System.out.println("where子句 右子句:" + sqlNode1.toString());
                        }
                    }
                }
            }
            //标识符
            if (SqlKind.IDENTIFIER.equals(from.getKind())) {
                System.out.println("sql kind from:" + from.toString());
            } else if (SqlKind.JOIN.equals(from.getKind())) {
                System.out.println("左连接:" + ((SqlJoin) from).getLeft());
                System.out.println("又连接:" + ((SqlJoin) from).getRight());
            }


            selectList.getList().forEach(x -> {
                if (SqlKind.IDENTIFIER.equals(x.getKind())) {
                    System.out.println("sql 查询字段:" + x.toString());
                }
            });
        }
    }

}
