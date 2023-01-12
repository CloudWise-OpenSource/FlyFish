package com.cloudwise.lcap.commonbase.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.cloudwise.lcap.commonbase.entity.AppVar;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AppVarMapper extends BaseMapper<AppVar> {

    @Select("select * from app_var where app_id=#{appId} and deleted=0")
    public List<AppVar> selectByAppId(@Param("appId")String appId);
}
