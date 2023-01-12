package com.cloudwise.lcap.commonbase.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.cloudwise.lcap.commonbase.entity.Tag;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

/**
 * @author JD
 */
@Mapper
@Repository
public interface TagMapper extends BaseMapper<Tag> {


}
