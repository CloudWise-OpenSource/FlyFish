package com.cloudwise.lcap.commonbase.service.impl;


import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.cloudwise.lcap.commonbase.entity.*;
import com.cloudwise.lcap.commonbase.enums.ResourceType;
import com.cloudwise.lcap.commonbase.service.IApplicationProjectRefService;
import com.cloudwise.lcap.commonbase.service.IComponentProjectRefService;
import com.cloudwise.lcap.commonbase.service.IProjectRefService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * <p>
 *  服务实现类
 * </p>
 *
 * @author luke.miao
 * @since 2022-08-04
 */
@Service
public class ProjectRefServiceImpl implements IProjectRefService {
    @Autowired
    IApplicationProjectRefService iApplicationProjectRefService;

    @Autowired
    IComponentProjectRefService iComponentProjectRefService;

    public void updateProjectsRef(String refId, List<String> projectIds, String type) {
        if (ResourceType.APPLICATION.getType().equals(type)){
            LambdaQueryWrapper<ApplicationProjectRef> queryWrapper = new LambdaQueryWrapper<>();
            queryWrapper.eq(ApplicationProjectRef::getApplicationId, refId);
            iApplicationProjectRefService.getBaseMapper().delete(queryWrapper);
            // 更新application_tag_ref表
            List<ApplicationProjectRef> updateRef = projectIds.stream().map(p -> {
                ApplicationProjectRef atr = new ApplicationProjectRef();
                atr.setProjectId(p);
                atr.setApplicationId(refId);
                return atr;
            }).collect(Collectors.toList());
            iApplicationProjectRefService.saveBatch(updateRef);
        } else if (ResourceType.COMPONENT.getType().equals(type)) {
            LambdaQueryWrapper<ComponentProjectRef> queryWrapper = new LambdaQueryWrapper<>();
            queryWrapper.eq(ComponentProjectRef::getComponentId, refId);
            iComponentProjectRefService.getBaseMapper().delete(queryWrapper);
            // 更新application_tag_ref表
            List<ComponentProjectRef> updateRef = projectIds.stream().map(p -> {
                ComponentProjectRef atr = new ComponentProjectRef();
                atr.setProjectId(p);
                atr.setComponentId(refId);
                return atr;
            }).collect(Collectors.toList());
            iComponentProjectRefService.saveBatch(updateRef);
        }
    }
}
