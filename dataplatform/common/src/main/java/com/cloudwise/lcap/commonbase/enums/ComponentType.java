package com.cloudwise.lcap.commonbase.enums;

import com.cloudwise.lcap.commonbase.validation.IEnumValidate;
import org.apache.commons.lang3.StringUtils;

public enum ComponentType implements IEnumValidate<String> {
  COMMON("common"),
  PROJECT("project");
  private String type;


  private ComponentType(String type) {
    this.type =type;
  }

  public String getType() {
    return this.type;
  }

  @Override
  public boolean existValidate(String value) {
    if (StringUtils.isEmpty(value)) {
      return true;
    }
    for (ComponentType componentType : ComponentType.values()) {
      if (componentType.getType().equals(value)) {
        return true;
      }
    }
    return false;
  }
}
