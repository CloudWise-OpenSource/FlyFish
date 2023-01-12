package com.cloudwise.lcap.commonbase.validation;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

public class EnumValidator implements ConstraintValidator<EnumValid, Object> {

  private Class<? extends Enum> enumClass;

  @Override
  public void initialize(EnumValid enumValid) {
    enumClass = enumValid.enumClass();
  }

  @Override
  public boolean isValid(Object value, ConstraintValidatorContext context) {
    IEnumValidate[] enums = (IEnumValidate[]) enumClass.getEnumConstants();
    if(enums ==null || enums.length == 0){
      return false;
    }

    return enums[0].existValidate(value);
  }
}

