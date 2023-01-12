package com.cloudwise.lcap.controller;


import com.cloudwise.lcap.commonbase.service.ITagService;
import com.cloudwise.lcap.commonbase.vo.TagVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * <p>
 *  前端控制器
 * </p>
 *
 * @author june.yang
 * @since 2022-08-01
 */
@RestController
@RequestMapping("/tags")
public class TagController {

    @Autowired
    ITagService iTagService;

    @GetMapping("/get-all")
    public List<TagVo> getTagList(@RequestParam("type") String type){
        return iTagService.getTagList(type);
    }
}
