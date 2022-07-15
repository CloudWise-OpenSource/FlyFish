package com.cloudwise.lcap.test.udf;

import com.google.common.collect.ImmutableList;
import org.apache.calcite.DataContext;
import org.apache.calcite.adapter.java.AbstractQueryableTable;
import org.apache.calcite.config.CalciteConnectionConfig;
import org.apache.calcite.linq4j.*;
import org.apache.calcite.rel.externalize.RelJsonReader;
import org.apache.calcite.rel.type.RelDataType;
import org.apache.calcite.rel.type.RelDataTypeFactory;
import org.apache.calcite.runtime.SqlFunctions;
import org.apache.calcite.schema.*;
import org.apache.calcite.schema.impl.AbstractTable;
import org.apache.calcite.sql.SqlCall;
import org.apache.calcite.sql.SqlNode;
import org.apache.calcite.sql.type.SqlTypeName;
import org.apache.calcite.util.Util;
import org.checkerframework.checker.nullness.qual.Nullable;

import java.io.IOException;
import java.lang.reflect.Method;
import java.sql.Date;
import java.sql.Time;
import java.sql.Timestamp;
import java.util.AbstractList;
import java.util.List;

/**
 * Holder for various classes and functions used in tests as user-defined
 * functions and so forth.
 * {@link org.apache.calcite.sql.fun.SqlStdOperatorTable}
 */
public class UdfMethods {
    public static Method oneThreePlus;
    public static Method STRING_UNION_METHOD;
    public static Method GENERATE_STRINGS_METHOD;
    public static Method MULTIPLICATION_TABLE_METHOD;
    public static Method DUMMY_TABLE_METHOD_WITH_TWO_PARAMS;
    public static Method DYNAMIC_ROW_TYPE_TABLE_METHOD;
    public static Method PROCESS_CURSOR_METHOD;
    public static Method PROCESS_CURSORS_METHOD;
    public static Method dateToLong;
    public static Method timestampToLong;
    public static Method timeToLong;
    public static Method longToDate;
    public static Method longToTime;
    public static Method longToTimestamp;
   // public static final Method IF_NULL = Types.lookupMethod(_VARCHAR.class, "if_null", Object.class,Object.class);
    static {
        try {
            oneThreePlus = UdfMethods.class.getDeclaredMethod("oneThreePlus", String.class);
            STRING_UNION_METHOD = UdfMethods.class.getDeclaredMethod("stringUnion", Queryable.class, Queryable.class);
            MULTIPLICATION_TABLE_METHOD = UdfMethods.class.getDeclaredMethod("multiplicationTable", int.class, int.class, Integer.class);
            DUMMY_TABLE_METHOD_WITH_TWO_PARAMS = UdfMethods.class.getDeclaredMethod("dummyTableFuncWithTwoParams", long.class, long.class);
            DYNAMIC_ROW_TYPE_TABLE_METHOD = UdfMethods.class.getDeclaredMethod("dynamicRowTypeTable", String.class, int.class);
            PROCESS_CURSOR_METHOD = UdfMethods.class.getDeclaredMethod("processCursor", int.class, Enumerable.class);
            dateToLong = UdfMethods.class.getDeclaredMethod("dateToLong", Date.class);
            timeToLong = UdfMethods.class.getDeclaredMethod("timeToLong", Time.class);
            timestampToLong = UdfMethods.class.getDeclaredMethod("timestampToLong", Timestamp.class);
            longToDate = UdfMethods.class.getDeclaredMethod("longToDate", Long.class);
            longToTime = UdfMethods.class.getDeclaredMethod("longToTime", Long.class);
            longToTimestamp = UdfMethods.class.getDeclaredMethod("longToTimestamp", Long.class);
        } catch (NoSuchMethodException e) {
            e.printStackTrace();
        }
    }

    private UdfMethods() {
    }

    private static QueryableTable oneThreePlus(String s) {
        List<Integer> items;
        // Argument is null in case SQL contains function call with expression.
        // Then the engine calls a function with null arguments to get getRowType.
        if (s == null) {
            items = ImmutableList.of();
        } else {
            Integer latest = Integer.parseInt(s.substring(1, s.length() - 1));
            items = ImmutableList.of(1, 3, latest);
        }
        final Enumerable<Integer> enumerable = Linq4j.asEnumerable(items);
        return new AbstractQueryableTable(Integer.class) {
            @Override
            public <E> Queryable<E> asQueryable(QueryProvider queryProvider, SchemaPlus schema, String tableName) {
                //noinspection unchecked
                return (Queryable<E>) enumerable.asQueryable();
            }

            @Override
            public RelDataType getRowType(RelDataTypeFactory typeFactory) {
                return typeFactory.builder().add("c", SqlTypeName.INTEGER).build();
            }
        };
    }

    public static <T> Queryable<T> stringUnion(Queryable<T> q0, Queryable<T> q1) {
        return q0.concat(q1);
    }


    /**
     * A function that generates multiplication table of {@code ncol} columns x
     * {@code nrow} rows.
     * @param ncol 列数
     * @param nrow 行数
     * @param offset 偏移量
     */
    public static QueryableTable multiplicationTable(final int ncol, final int nrow, Integer offset) {
        final int offs = offset == null ? 0 : offset;
        return new AbstractQueryableTable(Object[].class) {
            @Override
            public RelDataType getRowType(RelDataTypeFactory typeFactory) {
                final RelDataTypeFactory.Builder builder = typeFactory.builder();
                builder.add("row_name", typeFactory.createJavaType(String.class));
                final RelDataType int_ = typeFactory.createJavaType(int.class);
                for (int i = 1; i <= ncol; i++) {
                    builder.add("c" + i, int_);
                }
                return builder.build();
            }

            @Override
            public Queryable<Object[]> asQueryable(QueryProvider queryProvider, SchemaPlus schema, String tableName) {
                final List<Object[]> table = new AbstractList<Object[]>() {
                    @Override
                    public Object[] get(int index) {
                        Object[] cur = new Object[ncol + 1];
                        cur[0] = "row " + index;
                        for (int j = 1; j <= ncol; j++) {
                            cur[j] = j * (index + 1) + offs;
                        }
                        return cur;
                    }

                    @Override
                    public int size() {
                        return nrow;
                    }
                };
                return Linq4j.asEnumerable(table).asQueryable();
            }
        };
    }


    /**
     * A function that takes 2 param as input.
     */
    public static ScannableTable dummyTableFuncWithTwoParams(final long param1, final long param2) {
        return new ScannableTable() {
            @Override
            public RelDataType getRowType(RelDataTypeFactory typeFactory) {
                return typeFactory.builder().add("N", SqlTypeName.BIGINT).build();
            }

            @Override
            public Enumerable<@Nullable Object[]> scan(DataContext root) {
                return new AbstractEnumerable<Object[]>() {
                    @Override
                    public Enumerator<Object[]> enumerator() {
                        return new Enumerator<Object[]>() {
                            @Override
                            public Object[] current() {
                                return new Object[]{};
                            }

                            @Override
                            public boolean moveNext() {
                                return false;
                            }

                            @Override
                            public void reset() {
                            }

                            @Override
                            public void close() {
                            }
                        };
                    }
                };
            }

            @Override
            public Statistic getStatistic() {
                return Statistics.UNKNOWN;
            }

            @Override
            public Schema.TableType getJdbcTableType() {
                return Schema.TableType.TABLE;
            }

            @Override
            public boolean isRolledUp(String column) {
                return false;
            }

            @Override
            public boolean rolledUpColumnValidInsideAgg(String column, SqlCall call, @Nullable SqlNode parent, @Nullable CalciteConnectionConfig config) {
                return true;
            }
        };
    }


    public static ScannableTable dynamicRowTypeTable(String jsonRowType, int rowCount) {
        return new DynamicRowTypeTable(jsonRowType, rowCount);
    }

    /**
     * A table whose row type is determined by parsing a JSON argument.
     */
    private static class DynamicRowTypeTable extends AbstractTable implements ScannableTable {
        private final String jsonRowType;

        DynamicRowTypeTable(String jsonRowType, int count) {
            this.jsonRowType = jsonRowType;
        }

        @Override
        public RelDataType getRowType(RelDataTypeFactory typeFactory) {
            try {
                return RelJsonReader.readType(typeFactory, jsonRowType);
            } catch (IOException e) {
                throw Util.throwAsRuntime(e);
            }
        }

        @Override
        public Enumerable<@Nullable Object[]> scan(DataContext root) {
            return Linq4j.emptyEnumerable();
        }
    }

    /**
     * Table function that adds a number to the first column of input cursor.
     */
    public static QueryableTable processCursor(final int offset, final Enumerable<Object[]> a) {
        return new AbstractQueryableTable(Object[].class) {
            @Override
            public RelDataType getRowType(RelDataTypeFactory typeFactory) {
                return typeFactory.builder().add("result", SqlTypeName.INTEGER).build();
            }

            @Override
            public <T> Queryable<T> asQueryable(QueryProvider queryProvider, SchemaPlus schema, String tableName) {
                final Enumerable<Integer> enumerable = a.select(a0 -> offset + ((Integer) a0[0]));
                //noinspection unchecked
                return (Queryable) enumerable.asQueryable();
            }
        };
    }

    // We use SqlFunctions.toLong(Date) ratter than Date.getTime(),
    // and SqlFunctions.internalToTimestamp(long) rather than new Date(long),
    // because the contract of JDBC (also used by UDFs) is to represent
    // date-time values in the LOCAL time zone.


    public static Date longToDate(Long v) {
        return v == null ? null : SqlFunctions.internalToDate(v.intValue());
    }

    public static Time longToTime(Long v) {
        return v == null ? null : SqlFunctions.internalToTime(v.intValue());
    }

    public static Timestamp longToTimestamp(Long v) {
        return SqlFunctions.internalToTimestamp(v);
    }

    public static long dateToLong(Date date) {
        return date == null ? 0 : SqlFunctions.toLong(date);
    }

    public static long timeToLong(Time time) {
        return time == null ? 0 : SqlFunctions.toLong(time);
    }

    public static long timestampToLong(Timestamp timestamp) {
        return timestamp == null ? 0 : SqlFunctions.toLong(timestamp);
    }






}
