package com.cloudwise.lcap.test.udf.tablefunc;

import org.apache.calcite.DataContext;
import org.apache.calcite.config.CalciteConnectionConfig;
import org.apache.calcite.linq4j.AbstractEnumerable;
import org.apache.calcite.linq4j.Enumerable;
import org.apache.calcite.linq4j.Enumerator;
import org.apache.calcite.rel.type.RelDataType;
import org.apache.calcite.rel.type.RelDataTypeFactory;
import org.apache.calcite.schema.ScannableTable;
import org.apache.calcite.schema.Schema;
import org.apache.calcite.schema.Statistic;
import org.apache.calcite.schema.Statistics;
import org.apache.calcite.sql.SqlCall;
import org.apache.calcite.sql.SqlNode;
import org.apache.calcite.sql.type.SqlTypeName;
import org.checkerframework.checker.nullness.qual.Nullable;

/**
 * Example of a UDF with non-default constructor.
 *
 * <p>Not used; we do not currently have a way to instantiate function
 * objects other than via their default constructor.
 */
public  class FibonacciTableFunction {
    /**
     * A function that generates the Fibonacci sequence.
     * Interesting because it has one column and no arguments.
     */
    public ScannableTable eval(Integer limit) {
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
                            private long prev = 1;
                            private long current = 0;

                            @Override
                            public Object[] current() {
                                return new Object[]{current};
                            }

                            @Override
                            public boolean moveNext() {
                                final long next = current + prev;
                                if (limit >= 0 && next > limit) {
                                    return false;
                                }
                                prev = current;
                                current = next;
                                return true;
                            }

                            @Override
                            public void reset() {
                                prev = 0;
                                current = 1;
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
}