package com.cloudwise.lcap.commonbase.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.cloudwise.lcap.commonbase.entity.ComponentGroup;
import com.cloudwise.lcap.commonbase.vo.PageBaseListRespVo;

import java.util.List;
import java.util.Map;

public interface IComponentGroupService extends IService<ComponentGroup> {

    Page<ComponentGroup> findList(String id, Integer curPage, Integer pageSize);
}
