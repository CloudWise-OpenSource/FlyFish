```
/**
* SqlFunction 也是算子，怎么手动注册呢？
*     ListSqlOperatorTable listSqlOperatorTable = new ListSqlOperatorTable();
*             listSqlOperatorTable.add(FUNC1);
*             listSqlOperatorTable.add(FUNC2);
*  FrameworkConfig funcConfig = Frameworks.newConfigBuilder()
*                     .defaultSchema(rootSchema.plus())
*                     .parserConfig(builder.build())
*                     //添加一个专们用于添加函数的 listSqlOperatorTable
*                     .operatorTable(ChainedSqlOperatorTable.of(listSqlOperatorTable, SqlStdOperatorTable.instance()))
*                     .build();
* FrameworkConfig 怎么用呢？
* 学习方式：
* 查看源码确认 SqlFunction 的众多引用,比如 {@link org.apache.calcite.sql.fun.SqlJsonExistsFunction}
* 其中SqlReturnTypeInference 有定义好的实现 ReturnTypes
*  SqlOperandTypeInference 有可用的使用方式如 OperandTypes.or(
*             OperandTypes.family(SqlTypeFamily.ANY, SqlTypeFamily.CHARACTER),
*             OperandTypes.family(SqlTypeFamily.ANY, SqlTypeFamily.CHARACTER,
*                 SqlTypeFamily.ANY)),
*
*  {@link org.apache.calcite.runtime.SqlFunctions} 其实是 util，没多大用
* RelDataType 代表的意义？生成方式 工厂类 {@link RelDataTypeFactory}
  */
  public class RelDataTypeTest {

  /**
    *   public class SqlFunction extends SqlOperator(
    *       String name,  Name of built-in function
    *       SqlKind kind, {@link SqlKind} kind of operator implemented by function
    *       @Nullable SqlReturnTypeInference returnTypeInference,{@link ReturnTypes} strategy to use for return type inference
    *       @Nullable SqlOperandTypeInference operandTypeInference,{@link OperandTypes}
    *       @Nullable SqlOperandTypeChecker operandTypeChecker,
    *       SqlFunctionCategory category)
  */
```
