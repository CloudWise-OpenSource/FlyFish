package com.cloudwise.lcap.controller;

import com.cloudwise.lcap.commonbase.entity.ComponentGroupCategory;
import com.cloudwise.lcap.commonbase.service.IComponentGroupCatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/component-gp-cat")
public class ComponentGroupCatController {

    @Autowired
    private IComponentGroupCatService iComponentGroupCatService;

    @GetMapping("list")
    public List<Map> findList(){
        List<Map> componentGroupCategories = iComponentGroupCatService.findList();
        return componentGroupCategories;
    }
}
