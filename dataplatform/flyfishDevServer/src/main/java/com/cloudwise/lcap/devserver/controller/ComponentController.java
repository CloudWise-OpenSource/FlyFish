package com.cloudwise.lcap.devserver.controller;



import cn.hutool.core.date.LocalDateTimeUtil;
import com.cloudwise.lcap.commonbase.service.IComponentService;
import com.cloudwise.lcap.commonbase.vo.*;
import com.cloudwise.lcap.devserver.service.ComponentService;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.ArrayList;
import java.util.List;

/**
 * <p>
 *  前端控制器
 * </p>
 *
 * @author ethan.du
 * @since 2022-08-01
 */
@RestController
@RequestMapping("/components")
public class ComponentController {

  @Autowired
  IComponentService iComponentService;

  @Autowired
  ComponentService componentService;

  @PostMapping("")
  public IdRespVo add(@Validated @RequestBody ComponentReqDevVo componentReqDevVo){
    return componentService.addComponent(componentReqDevVo);
  }


  @PostMapping("/copy/{id}")
  public IdRespVo copyComponent(@PathVariable String id, @Validated @RequestBody ComponentCopyReqVo copyInfo){
    return componentService.copyComponent(id, copyInfo);
  }

  @DeleteMapping("/{id}")
  public void delete(@PathVariable("id") String id){
    iComponentService.delete(id);
  }

  @PostMapping("/release/{id}")
  public void release(@PathVariable String id,@Validated @RequestBody CommonReleaseReqVo commonReleaseReqVo){
    iComponentService.releaseComponent(id,commonReleaseReqVo);
  }

  @PutMapping("{id}")
  public IdRespVo updateInfo(@PathVariable("id")String id,@Validated @RequestBody ComponentReqVo componentReqVo){
    return iComponentService.updateInfo(id,componentReqVo);
  }

  @PostMapping("/compile/{id}")
  public IdRespVo compileComponent(@PathVariable String id){
    return iComponentService.compileComponent(id);
  }

  @PostMapping("/install/{id}")
  public IdRespVo installComponentDepend(@PathVariable String id){
    return iComponentService.installComponentDepend(id);
  }

  @GetMapping("/export-source-code/{id}")
  public void exportComponent(HttpServletRequest request, HttpServletResponse response, @PathVariable String id){ iComponentService.exportComponent(request, response, id); }

  @PostMapping("/import-source-code/{id}")
  public IdRespVo importComponent(@PathVariable String id, @RequestPart MultipartFile file){
    return iComponentService.importComponent(id, file);
  }

  @GetMapping("/git-history/{id}")
  public PageBaseListRespVo getComponentHistory(@PathVariable String id, @RequestParam(value = "curPage", required = false, defaultValue = "1") Integer curPage,@RequestParam(value = "pageSize", required = false, defaultValue = "10") Integer pageSize){
    return iComponentService.getComponentHistory(id, curPage, pageSize);
  }

  @GetMapping("/git-commit-info/{id}")
  public String getComponentCommitInfo(@PathVariable String id, @RequestParam String hash){
    return iComponentService.getComponentCommitInfo(id, hash);
  }
}
