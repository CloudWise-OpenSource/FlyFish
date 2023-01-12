package com.cloudwise.lcap.devserver.service;

import cn.hutool.core.collection.CollectionUtil;
import cn.hutool.core.io.FileUtil;
import cn.hutool.json.JSONObject;
import cn.hutool.json.JSONUtil;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.cloudwise.lcap.commonbase.contants.Constant;
import com.cloudwise.lcap.commonbase.entity.AppVar;
import com.cloudwise.lcap.commonbase.entity.Application;
import com.cloudwise.lcap.commonbase.enums.AppDevStatus;
import com.cloudwise.lcap.commonbase.enums.ResourceType;
import com.cloudwise.lcap.commonbase.enums.ResultCode;
import com.cloudwise.lcap.commonbase.exception.BaseException;
import com.cloudwise.lcap.commonbase.mapper.ApplicationMapper;
import com.cloudwise.lcap.commonbase.mapper.TradeMapper;
import com.cloudwise.lcap.commonbase.mapstruct.StructUtil;
import com.cloudwise.lcap.commonbase.service.*;
import com.cloudwise.lcap.commonbase.threadlocal.ThreadLocalContext;
import com.cloudwise.lcap.commonbase.util.FileUtils;
import com.cloudwise.lcap.commonbase.util.JsonUtils;
import com.cloudwise.lcap.commonbase.util.ResourceUtil;
import com.cloudwise.lcap.commonbase.util.Snowflake;
import com.cloudwise.lcap.commonbase.vo.*;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.File;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import static com.cloudwise.lcap.commonbase.contants.Constant.APPLICATIONS;

@Slf4j
@Service
public class ApplicationService extends ServiceImpl<ApplicationMapper, Application> {
    @Autowired
    IProjectService iProjectService;
    @Autowired
    TradeMapper tradeMapper;

    @Autowired
    ITagRefService iTagRefService;
    @Autowired
    IAppVarService iAppVarService;

    @Value("${lcap.application.default_cover_path}")
    private String defaultApplicationCoverPath;

    @Value("${lcap_www_relative_path}")
    private String lcap_www_relative_path;
    @Value("${portal_web_path}")
    private String portal_web_path;

    @Value("${lcap.application.path}")
    private String lcap_applications_path;

    @Autowired
    IApplicationComponentRefService iApplicationComponentRefService;

    @Autowired
    IApplicationTagRefService iApplicationTagRefService;

    @Autowired
    IProjectTradeRefService iProjectTradeRefService;

    @Autowired
    StructUtil structUtil;

    public IdRespVo create(ApplicationCreateReqVo createInfo) {
        Long accountId = ThreadLocalContext.getAccountId();
        LambdaQueryWrapper<Application> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(Application::getName, createInfo.getName()).eq(Application::getInvalid, 0).in(Application::getAccountId, Arrays.asList(accountId, Constant.INNER_ACCOUNT_ID));

        Long count = baseMapper.selectCount(queryWrapper);
        if (count > 0) {
            throw new BaseException(ResultCode.ALREADY_EXISTS.getCode(), ResultCode.ALREADY_EXISTS.getMsg());
        }

        String applicationId = Snowflake.INSTANCE.nextId().toString();
        String cover = lcap_www_relative_path + APPLICATIONS + "/" + applicationId + "/cover.jpeg";
        FileUtil.copy(portal_web_path + defaultApplicationCoverPath,portal_web_path + cover,true);
        Application newApplication = Application.builder().id(applicationId).name(createInfo.getName()).type(createInfo.getType())
                        .cover(cover).projectId(createInfo.getProjectId()).pages("[]").build();

        baseMapper.insert(newApplication);
        if (createInfo.getTags() != null && createInfo.getTags().size() != 0) {
            iTagRefService.updateTagsRef(newApplication.getId(), createInfo.getTags(), ResourceType.APPLICATION.getType());
        }

        return new IdRespVo(newApplication.getId());
    }

    public IdRespVo copyApp(String id, ApplicationCopyReqVo appInfo) {
        Application existApplication = ResourceUtil.checkResource(baseMapper, id);
        // 判断name是否有重复项
        Long accountId = ThreadLocalContext.getAccountId();

        LambdaQueryWrapper<Application> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(Application::getName, appInfo.getName())
                .eq(Application::getInvalid, 0)
                .in(Application::getAccountId, Arrays.asList(accountId, Constant.INNER_ACCOUNT_ID));

        Long count = baseMapper.selectCount(queryWrapper);
        if (count > 0) {
            throw new BaseException(ResultCode.ALREADY_EXISTS.getCode(), ResultCode.ALREADY_EXISTS.getMsg());
        }
        String projectId = appInfo.getProjectId();
        if (StringUtils.isEmpty(projectId)) {
            projectId = existApplication.getProjectId();
        }
        List<TagVo> tags = appInfo.getTags();
        if (CollectionUtil.isNotEmpty(tags)) {
            iTagRefService.updateTagsRef(id, tags, ResourceType.APPLICATION.getType());
        }

        Long newAppId = Snowflake.INSTANCE.nextId();
        if (new File(lcap_applications_path + File.separator + id).exists()) {
            File[] files = new File(lcap_applications_path + File.separator + id).listFiles();
            for (File file : files) {
                FileUtils.copyFolder(file.getAbsolutePath(), null, lcap_applications_path + File.separator + newAppId);
            }
        }
        List<JSONObject> pageList = JsonUtils.parseArray(existApplication.getPages(), JSONObject.class);
        if (pageList != null) {
            for (JSONObject page : pageList) {
                JSONObject options = page.getJSONObject("options");
                if (null != options && null != options.getStr("backgroundImage")) {
                    String backgroundImage = options.getStr("backgroundImage");
                    options.set("backgroundImage", backgroundImage.replace(id, newAppId.toString()));
                }
                List<JSONObject> components = page.getBeanList("components", JSONObject.class);
                if (CollectionUtil.isNotEmpty(components)) {
                    for (JSONObject component : components) {
                        if ("PageLink".equalsIgnoreCase(page.getStr("type"))) {
                            continue;
                        }
                        JSONObject componentOption = component.getJSONObject("options");
                        if (componentOption != null && null != componentOption.getStr("image")) {
                            String image = componentOption.getStr("image");
                            componentOption.set("image", image.replace(id, newAppId.toString()));
                        }
                    }
                }
            }
        }
        String cover = existApplication.getCover();
        if (StringUtils.isNotBlank(cover)) {
            if (!cover.startsWith("/")) {
                cover = File.separator + cover;
            }
            if (!new File(portal_web_path + cover).exists()) {
                cover = defaultApplicationCoverPath;
            } else {
                cover = cover.replace(id, newAppId.toString());
            }
        }
        Application newApp = Application.builder().id(newAppId.toString()).name(appInfo.getName()).projectId(projectId).type(existApplication.getType())
                .pages(JSONUtil.toJsonStr(pageList)).cover(cover).developStatus(AppDevStatus.DOING.getType()).models(existApplication.getModels())
                .accountId(accountId).creator(ThreadLocalContext.getUserId()).build();
        baseMapper.insert(newApp);

        // 复制变量
        LambdaQueryWrapper<AppVar> appVarWrapper = new LambdaQueryWrapper<>();
        appVarWrapper.eq(AppVar::getAppId, id);
        List<AppVar> appVars = iAppVarService.getBaseMapper().selectList(appVarWrapper);
        List<AppVarReqVo> insertAppVars = appVars.stream().map(appVar -> {
            AppVarReqVo newVar = new AppVarReqVo();
            newVar.setAppId(newApp.getId());
            newVar.setType(appVar.getType());
            newVar.setName(appVar.getName());
            newVar.setScope(appVar.getScope());
            newVar.setPageId(appVar.getPageId());
            newVar.setValueType(appVar.getValueType());
            newVar.setDefaultValue(appVar.getDefaultValue());
            newVar.setPath(appVar.getPath());
            return newVar;
        }).collect(Collectors.toList());
        if (!CollectionUtil.isEmpty(insertAppVars)) {
            iAppVarService.batchCreateAppVar(insertAppVars);
        }

        return new IdRespVo(newApp.getId());
    }


}
