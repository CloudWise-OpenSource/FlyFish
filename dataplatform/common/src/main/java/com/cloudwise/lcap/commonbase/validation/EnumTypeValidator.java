package com.cloudwise.lcap.commonbase.validation;

import java.util.Arrays;
import java.util.List;
import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

public class EnumTypeValidator implements ConstraintValidator<EnumType, String> {
  private List<String> enumStringList;

  @Override
  public void initialize(EnumType constraintAnnotation) {
    enumStringList = Arrays.asList(constraintAnnotation.type());
  }

  @Override
  public boolean isValid(String value, ConstraintValidatorContext context) {
    if(value == null){
      return true;
    }
    return enumStringList.contains(value);
  }
}

