package com.cloudwise.lcap.commonbase.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.cloudwise.lcap.commonbase.entity.ComponentGroup;
import com.cloudwise.lcap.commonbase.mapper.ComponentGroupMapper;
import com.cloudwise.lcap.commonbase.service.IComponentGroupService;
import com.cloudwise.lcap.commonbase.vo.PageBaseListRespVo;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ComponentGroupServiceImpl extends ServiceImpl<ComponentGroupMapper, ComponentGroup> implements IComponentGroupService {

    @Override
    public Page<ComponentGroup> findList(String id, Integer curPage, Integer pageSize) {

        LambdaQueryWrapper<ComponentGroup> queryWrapper = new LambdaQueryWrapper<>();
        if(StringUtils.isNotBlank(id)){
            queryWrapper.and(tmp -> tmp.eq(ComponentGroup::getCategoryFirstId, id)
                    .or().eq(ComponentGroup::getCategorySecondId, id));
        }
        queryWrapper.orderByDesc(ComponentGroup::getUpdateTime);
        Page<ComponentGroup> page = new Page<>(curPage, pageSize);
        page = baseMapper.selectPage(page, queryWrapper);


        return page;
    }
}
