/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to you under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package com.cloudwise.lcap.test.udf.hr;

import java.util.Objects;

/**
 * Location model.
 */
public class  Location {
  public final int x;
  public final int y;

  public Location(int x, int y) {
    this.x = x;
    this.y = y;
  }

  @Override public String toString() {
    return "Location [x: " + x + ", y: " + y + "]";
  }

  @Override public boolean equals(Object obj) {
    return obj == this
        || obj instanceof Location
        && x == ((Location) obj).x
        && y == ((Location) obj).y;
  }

  @Override public int hashCode() {
    return Objects.hash(x, y);
  }
}
