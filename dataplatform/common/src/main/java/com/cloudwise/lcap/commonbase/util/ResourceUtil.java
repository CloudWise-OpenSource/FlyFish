package com.cloudwise.lcap.commonbase.util;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.cloudwise.lcap.commonbase.enums.ResultCode;
import com.cloudwise.lcap.commonbase.exception.BaseException;
import org.springframework.stereotype.Component;

@Component
public class ResourceUtil {

  public static  <T> T checkResource(BaseMapper<T> baseMapper,String id){
    T object = baseMapper.selectById(id);
      if(object==null){
        throw new BaseException(ResultCode.DB_NOT_FOUND.getCode(),
            ResultCode.DB_NOT_FOUND.getMsg());
      }
    return object;
  }

}
