package com.cloudwise.lcap.commonbase.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.cloudwise.lcap.commonbase.entity.AppAuth;
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
public interface AppAuthMapper extends BaseMapper<AppAuth> {

    /**
     * 获取内置的专属lcap的应用信息
     * @return
     */
    AppAuth queryLcapAppAuth();
}
