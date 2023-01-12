package com.cloudwise.lcap.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.cloudwise.lcap.commonbase.entity.ComponentGroup;
import com.cloudwise.lcap.commonbase.service.IComponentGroupService;
import oracle.jdbc.proxy.annotation.Post;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/component-group")
public class ComponentGroupController {

    @Autowired
    private IComponentGroupService componentGroupService;

    @GetMapping("/findList-by-category")
    public Page<ComponentGroup>  findListByCategory(@RequestParam(value = "id", required = false) String id,
                                                    @RequestParam(value = "curPage", required = false, defaultValue = "0") Integer curPage,
                                                    @RequestParam(value = "pageSize", required = false, defaultValue = "10") Integer pageSize){
        Page<ComponentGroup> componentGroupPage = componentGroupService.findList(id, curPage, pageSize);
        return componentGroupPage;
    }
}
