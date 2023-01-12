package com.cloudwise.lcap.commonbase.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.cloudwise.lcap.commonbase.entity.ComponentGroupCategory;
import com.cloudwise.lcap.commonbase.mapper.ComponentGroupCatMapper;
import com.cloudwise.lcap.commonbase.service.IComponentGroupCatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ComponentGroupCatServiceImpl extends ServiceImpl<ComponentGroupCatMapper, ComponentGroupCategory> implements IComponentGroupCatService {




    @Override
    public List<Map> findList() {
        //获取全部分类
        LambdaQueryWrapper<ComponentGroupCategory> queryWrapper1 = new LambdaQueryWrapper<>();
        queryWrapper1.eq(ComponentGroupCategory::getParentId, 0);
        List<ComponentGroupCategory> componentGroupCategories = baseMapper.selectList(queryWrapper1);
        List<Map> test = new ArrayList<>();
        for(ComponentGroupCategory componentGroupCategory : componentGroupCategories){
            Map fatherMap = new HashMap();
            fatherMap.put("id", componentGroupCategory.getId());
            fatherMap.put("name", componentGroupCategory.getName());

            List children = new ArrayList();
            LambdaQueryWrapper<ComponentGroupCategory> queryWrapper = new LambdaQueryWrapper<>();
            queryWrapper.eq(ComponentGroupCategory::getParentId, componentGroupCategory.getId());
            List<ComponentGroupCategory> componentGroupCategorieList = baseMapper.selectList(queryWrapper);
            if (componentGroupCategorieList != null && componentGroupCategorieList.size() > 0){
                for (ComponentGroupCategory componentGroupCat : componentGroupCategorieList){
                    Map sonMap = new HashMap();
                    sonMap.put("id", componentGroupCat.getId());
                    sonMap.put("name", componentGroupCat.getName());
                    children.add(sonMap);
                }
                fatherMap.put("children", children);
            }else {
                fatherMap.put("children", null);
            }
            test.add(fatherMap);

        }

        return test;
    }
}
