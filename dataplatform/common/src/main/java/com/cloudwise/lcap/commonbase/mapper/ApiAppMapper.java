package com.cloudwise.lcap.commonbase.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.cloudwise.lcap.commonbase.entity.ApiApp;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

/**
 * <p>
 *  Mapper 接口
 * </p>
 *
 * @author luke.miao
 * @since 2022-08-01
 */
@Mapper
@Repository
public interface ApiAppMapper extends BaseMapper<ApiApp> {

}
