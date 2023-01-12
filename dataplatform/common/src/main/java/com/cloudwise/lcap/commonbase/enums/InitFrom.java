package com.cloudwise.lcap.commonbase.enums;

public enum InitFrom {

  DOMA("doma"),
  DOCC("docc");

  private String type;

  private InitFrom(String type) {
    this.type = type;
  }

  public String getType() {
    return this.type;
  }
}
