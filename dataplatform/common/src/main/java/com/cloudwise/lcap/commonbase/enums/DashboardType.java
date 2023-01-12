package com.cloudwise.lcap.commonbase.enums;

public enum DashboardType {
  INTERNAL(1),
  CUSTOM(2);
  private final Integer type;

  private DashboardType(Integer type) {
    this.type = type;
  }

  public Integer getType() {
    return this.type;
  }
}
