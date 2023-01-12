package com.cloudwise.lcap.commonbase.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.cloudwise.lcap.commonbase.entity.Application;
import com.cloudwise.lcap.commonbase.entity.ComponentGroup;
import com.cloudwise.lcap.commonbase.entity.ComponentGroupCategory;

import java.util.List;
import java.util.Map;

public interface IComponentGroupCatService extends IService<ComponentGroupCategory> {

    List<Map> findList();
}
