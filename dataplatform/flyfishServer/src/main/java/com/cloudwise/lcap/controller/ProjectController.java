package com.cloudwise.lcap.controller;
import com.cloudwise.lcap.commonbase.exception.ParameterException;
import com.cloudwise.lcap.commonbase.service.IProjectService;
import com.cloudwise.lcap.commonbase.util.ValidatorUtils;
import com.cloudwise.lcap.commonbase.vo.IdRespVo;
import com.cloudwise.lcap.commonbase.vo.PageBaseListRespVo;
import com.cloudwise.lcap.commonbase.vo.ProjectReqVo;
import com.cloudwise.lcap.commonbase.vo.ProjectRespVo;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;


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
@RequestMapping("/projects")
public class ProjectController {

    @Autowired
    IProjectService iProjectService;

    @GetMapping("/list")
    public PageBaseListRespVo getList(@RequestParam(required = false) String key,@RequestParam(value = "curPage", required = false) Integer curPage,@RequestParam(value = "pageSize", required = false) Integer pageSize ) {
        return iProjectService.getList(key,curPage,pageSize);
    }

    @PostMapping("")
    public IdRespVo add(@Validated @RequestBody ProjectReqVo projectCreateReqVo){
        if (projectCreateReqVo.getName().length()>20){
            log.error("项目名长度超过最大长度20，projectName" + projectCreateReqVo.getName());
            throw new ParameterException("项目名长度超过20！");
        }
        if(!ValidatorUtils.validateLegalString(projectCreateReqVo.getName())){
            log.error("项目名不符合规则，projectName=" + projectCreateReqVo.getName());
            throw new ParameterException("项目名包含特殊字符");
        }
        return iProjectService.add(projectCreateReqVo);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable("id")String id){
        iProjectService.delete(id);
    }


    @PutMapping("/{id}")
    public IdRespVo edit(@PathVariable("id")String id,@Validated @RequestBody ProjectReqVo projectCreateReqVo){
        if (projectCreateReqVo.getName().length()>20){
            log.error("项目名长度超过最大长度20，projectName" + projectCreateReqVo.getName());
            throw new ParameterException("项目名长度超过20！");
        }
        if(!ValidatorUtils.validateLegalString(projectCreateReqVo.getName())){
            log.error("项目名不符合规则，projectName=" + projectCreateReqVo.getName());
            throw new ParameterException("项目名包含特殊字符");
        }
        return iProjectService.edit(id,projectCreateReqVo);
    }

    @GetMapping("/{id}")
    public ProjectRespVo get(@PathVariable("id")String id){
        return iProjectService.get(id);
    }
}
