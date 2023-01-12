package com.cloudwise.lcap.controller;


import com.cloudwise.lcap.commonbase.vo.*;
import com.cloudwise.lcap.commonbase.service.IComponentCategoryService;
import com.cloudwise.lcap.commonbase.service.IComponentService;

import java.util.List;

import com.mongodb.lang.NonNullApi;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RestController;
import javax.annotation.Nullable;

/**
 * <p>
 *  前端控制器
 * </p>
 *
 * @author ethan.du
 * @since 2022-08-01
 */
@Slf4j
@RestController
@RequestMapping("/components")
public class ComponentController {

  @Autowired
  IComponentService componentService;
  @Autowired
  IComponentCategoryService componentCategoryService;

  @PostMapping("/up-to-lib/{id}")
  public IdRespVo toLibComponent(@PathVariable String id, @Validated @RequestBody ToLibReqVo updateInfo){
    return componentService.toLib(id, updateInfo);
  }


  @GetMapping("/{id}")
  public ComponentInfoRespVo getComponentInfo(@PathVariable String id){
    return componentService.getComponentInfo(id);
  }

  @PostMapping("/categories/list")
  public List<ComponentCategoryRespVo> getCategoryList(@RequestBody(required = false) ComponentCategoryListReqVo componentCategoryReqVo){
    return componentCategoryService.getCategoryList(componentCategoryReqVo==null?"":componentCategoryReqVo.getKey());
  }

  @PostMapping("/categories")
  public IdRespVo addCategory(@Validated @RequestBody ComponentCategoryAddReqVo componentCategoryAddReqVo){
    return componentCategoryService.addCategory(componentCategoryAddReqVo);
  }

  @PostMapping("/list")
  public PageBaseListRespVo getList(@Validated @RequestBody ComponentListReqVo componentListReq){
    return componentService.getList(componentListReq);
  }


  @PutMapping("/categories/{id}")
  public IdRespVo updateCategory(@PathVariable("id")String id,@Validated @RequestBody ComponentCategoryAddReqVo componentCategoryAddReqVo){
    return componentCategoryService.updateCategory(id,componentCategoryAddReqVo.getName(),componentCategoryAddReqVo.getIcon());
  }

  @DeleteMapping("/categories/{id}")
  public void deleteCategory(@PathVariable("id")String id){
    componentCategoryService.deleteCategory(id);
  }

  @PostMapping("/list-with-category")
  public List<ComponentCategoryRespVo> getListWithCategory(@Nullable @RequestParam String id, @Nullable @RequestParam String name, @Validated @RequestParam String type, @Nullable @RequestParam Integer allowDataSearch){
    return componentService.getListWithCategory(id, name, type, allowDataSearch);
  }

  @PostMapping("/list-with-id-name")
  public PageBaseListRespVo getListByIdName(@Validated @RequestBody SearchComponentListReqVo searchComponentListReqVo){
    return componentService.getListByIdName(searchComponentListReqVo);
  }
}
