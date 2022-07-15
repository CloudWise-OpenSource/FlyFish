package com.cloudwise.lcap.test.udf.hr;

import com.google.common.collect.ImmutableList;

import java.util.Arrays;
import java.util.Collections;

/**
 * A schema that contains two tables by reflection.
 *
 * <p>Here is the SQL to create equivalent tables in Oracle:
 *
 * <blockquote>
 * <pre>
 * CREATE TABLE "emps" (
 *   "empid" INTEGER NOT NULL,
 *   "deptno" INTEGER NOT NULL,
 *   "name" VARCHAR2(10) NOT NULL,
 *   "salary" NUMBER(6, 2) NOT NULL,
 *   "commission" INTEGER);
 * INSERT INTO "emps" VALUES (100, 10, 'Bill', 10000, 1000);
 * INSERT INTO "emps" VALUES (200, 20, 'Eric', 8000, 500);
 * INSERT INTO "emps" VALUES (150, 10, 'Sebastian', 7000, null);
 * INSERT INTO "emps" VALUES (110, 10, 'Theodore', 11500, 250);
 *
 * CREATE TABLE "depts" (
 *   "deptno" INTEGER NOT NULL,
 *   "name" VARCHAR2(10) NOT NULL,
 *   "employees" ARRAY OF "Employee",
 *   "location" "Location");
 * INSERT INTO "depts" VALUES (10, 'Sales', null, (-122, 38));
 * INSERT INTO "depts" VALUES (30, 'Marketing', null, (0, 52));
 * INSERT INTO "depts" VALUES (40, 'HR', null, null);
 * </pre>
 * </blockquote>
 */
public class HrSchema {
  @Override public String toString() {
    return "HrSchema";
  }

  public final Employee[] emps = {
      new Employee(100, 10, "Bill", 10000, 1000),
      new Employee(200, 20, "Eric", 8000, 500),
      new Employee(150, 10, "Sebastian", 7000, null),
      new Employee(110, 10, "Theodore", 11500, 250),
  };
  public final Department[] depts = {
      new Department(10, "Sales", Arrays.asList(emps[0], emps[2]), new Location(-122, 38)),
      new Department(30, "Marketing", ImmutableList.of(), new Location(0, 52)),
      new Department(40, "HR", Collections.singletonList(emps[1]), null),
  };

  public final Product[] prod = {
          new Product(10, 100),
          new Product(30, 300),
          new Product(40, 400),
  };

}
