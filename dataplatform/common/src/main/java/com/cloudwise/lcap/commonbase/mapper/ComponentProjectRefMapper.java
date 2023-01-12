package com.cloudwise.lcap.commonbase.mapper;


import cn.hutool.json.JSONObject;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.cloudwise.lcap.commonbase.entity.ComponentProjectRef;
import org.apache.ibatis.annotations.Param;

import java.util.Collection;
import java.util.List;

/**
 * <p>
 *  Mapper 接口
 * </p>
 *
 * @author luke.miao
 * @since 2022-08-04
 */
public interface ComponentProjectRefMapper extends BaseMapper<ComponentProjectRef> {

    List<JSONObject> selectByComponentIds(@Param("ids") Collection<String> ids);

    int batchSave(@Param("ids") List<ComponentProjectRef> list);

}
