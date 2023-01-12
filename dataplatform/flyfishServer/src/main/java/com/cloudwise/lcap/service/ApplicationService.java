package com.cloudwise.lcap.service;

import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSONObject;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.cloudwise.lcap.commonbase.contants.Constant;
import com.cloudwise.lcap.commonbase.entity.*;
import com.cloudwise.lcap.commonbase.enums.InitFrom;
import com.cloudwise.lcap.commonbase.enums.ResourceType;
import com.cloudwise.lcap.commonbase.enums.ResultCode;
import com.cloudwise.lcap.commonbase.exception.BaseException;
import com.cloudwise.lcap.commonbase.mapper.ApplicationMapper;
import com.cloudwise.lcap.commonbase.mapper.ProjectMapper;
import com.cloudwise.lcap.commonbase.mapstruct.StructUtil;
import com.cloudwise.lcap.commonbase.service.*;
import com.cloudwise.lcap.commonbase.threadlocal.ThreadLocalContext;
import com.cloudwise.lcap.commonbase.util.BusinessUtils;
import com.cloudwise.lcap.commonbase.util.JsonUtils;
import com.cloudwise.lcap.commonbase.util.ResourceUtil;
import com.cloudwise.lcap.commonbase.vo.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ApplicationService extends ServiceImpl<ApplicationMapper, Application> {

    @Autowired
    private ProjectMapper projectMapper;
    @Autowired
    private ApplicationMapper applicationMapper;
    @Autowired
    ITagRefService iTagRefService;
    @Value("${lcap.application.default_cover_path}")
    private String defaultApplicationCoverPath;
//    @Autowired
//    DoucApiImp doucApiImp;
    @Resource
    private HttpServletRequest request;
    @Autowired
    StructUtil structUtil;

    @Autowired
    ITagService iTagService;

    @Autowired
    IApplicationTagRefService iApplicationTagRefService;

    @Autowired
    IProjectService iProjectService;
    @Autowired
    BaseUserService baseUserService;

    @Autowired
    IAppVarService iAppVarService;
    @Autowired
    IApplicationComponentRefService iApplicationComponentRefService;

    public IdRespVo create(ApplicationCreateReqVo createInfo) {
        Long accountId = ThreadLocalContext.getAccountId();
        LambdaQueryWrapper<Application> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(Application::getName, createInfo.getName()).eq(Application::getInvalid, 0).in(Application::getAccountId, Arrays.asList(accountId, Constant.INNER_ACCOUNT_ID));

        Long count = baseMapper.selectCount(queryWrapper);
        if (count > 0) {
            throw new BaseException(ResultCode.ALREADY_EXISTS.getCode(), ResultCode.ALREADY_EXISTS.getMsg());
        }

        Application newApplication = new Application();
        newApplication.setName(createInfo.getName());
        newApplication.setType(createInfo.getType());
        newApplication.setCover(defaultApplicationCoverPath);
        newApplication.setProjectId(createInfo.getProjectId());
        newApplication.setPages("[]");

        baseMapper.insert(newApplication);
        if (createInfo.getTags() != null && createInfo.getTags().size() != 0) {
            iTagRefService.updateTagsRef(newApplication.getId(), createInfo.getTags(), ResourceType.APPLICATION.getType());
        }

        return new IdRespVo(newApplication.getId());
    }


    public ApplicationDetailRespVo getBasicInfo(String id) {
        Application applicationInfo = ResourceUtil.checkResource(baseMapper, id);
        if(applicationInfo.getDeleted() == 1 || applicationInfo.getInvalid() == 1){
            throw new BaseException(ResultCode.DB_NOT_FOUND.getCode(), ResultCode.DB_NOT_FOUND.getMsg());
        }
        ApplicationDetailRespVo applicationDetailRespVo = structUtil.convertApplicationDetailRespVo(applicationInfo);

        Set<String> appIds = Collections.singleton(id);
        LambdaQueryWrapper<ApplicationTagRef> appWrapper = new LambdaQueryWrapper<>();
        appWrapper.in(ApplicationTagRef::getApplicationId, appIds);
        List<ApplicationTagRef> tagRefs = iApplicationTagRefService.getBaseMapper().selectList(appWrapper);
        List<String> tagIds = tagRefs.stream().map(ApplicationTagRef::getTagId).collect(Collectors.toList());
        Map<String, TagVo> tagMap = new HashMap<>();
        if (tagIds.size() > 0) {
            LambdaQueryWrapper<Tag> tagWrapper = new LambdaQueryWrapper<>();
            tagWrapper.in(Tag::getId, tagIds);

            List<Tag> tags = iTagService.getBaseMapper().selectList(tagWrapper);
            tags.forEach(t -> tagMap.put(t.getId(), structUtil.convertTagVo(t)));
        }
        HashMap<String, List<TagVo>> appTagMap = new HashMap<>();
        tagRefs.forEach(tr -> {
            String appId = tr.getApplicationId();
            String tagId = tr.getTagId();
            TagVo tag = tagMap.get(tagId);
            if (appTagMap.get(appId) == null) {
                ArrayList<TagVo> tagList = new ArrayList<>();
                tagList.add(tag);
                appTagMap.put(appId, tagList);
            } else {
                appTagMap.get(appId).add(tag);
            }
        });

        Set<String> projectIds = Collections.singleton(applicationInfo.getProjectId());
        LambdaQueryWrapper<Project> projectLambdaQueryWrapper = new LambdaQueryWrapper<>();
        projectLambdaQueryWrapper.in(Project::getId, projectIds);
        List<Project> projects = iProjectService.getBaseMapper().selectList(projectLambdaQueryWrapper);
        HashMap<String, Project> projectMap = new HashMap<>();
        projects.forEach(p -> {
            String pId = p.getId();
            projectMap.put(pId, p);
        });

        Project project = projectMap.get(applicationInfo.getProjectId());
        ProjectRespVo projectRespVo = structUtil.convertProjectRespVo(project);
        applicationDetailRespVo.setProjectInfo(projectRespVo);

        List<TagVo> tagVos = appTagMap.get(applicationInfo.getId());
        applicationDetailRespVo.setTags(tagVos);

//        List<JSONObject> usersInfo = doucApiImp.getUserInfoByIds(Arrays.asList(applicationInfo.getCreator(), applicationInfo.getUpdater()));
//        Optional<JSONObject> curCreatorUserInfo = usersInfo.stream().filter(i -> Objects.equals(Long.parseLong(i.getStr("userId")), applicationInfo.getCreator())).findFirst();
//        Optional<JSONObject> curUpdaterUserInfo = usersInfo.stream().filter(i -> Objects.equals(Long.parseLong(i.getStr("userId")), applicationInfo.getUpdater())).findFirst();
//        applicationDetailRespVo.setCreator(curCreatorUserInfo.isPresent() ? curCreatorUserInfo.get().getStr("name") : "-");
//        applicationDetailRespVo.setUpdater(curUpdaterUserInfo.isPresent() ? curUpdaterUserInfo.get().getStr("name") : "-");
        String userId = String.valueOf(ThreadLocalContext.getUserId());
        if(StrUtil.isNotBlank(userId)){
            BaseUser byId = baseUserService.getById(userId);
            applicationDetailRespVo.setCreator(byId.getUsername());
            applicationDetailRespVo.setUpdater(byId.getUsername());
        }

        List<JSONObject> pageList = JsonUtils.parseArray(applicationInfo.getPages(), JSONObject.class);
        BusinessUtils.renderPagesConfig(pageList);
        applicationDetailRespVo.setPages(pageList);

        // 获取变量相关信息
        LambdaQueryWrapper<AppVar> appVarWrapper = new LambdaQueryWrapper<>();
        appVarWrapper.eq(AppVar::getAppId, id);
        List<AppVar> appVars = iAppVarService.getBaseMapper().selectList(appVarWrapper);
        ArrayList<AppVarListResVo> appVarListResVos = new ArrayList<>();
        appVars.forEach(var -> {
            AppVarListResVo appVarListResVo = structUtil.convertAppVarRespVo(var);
            appVarListResVos.add(appVarListResVo);
        });
        applicationDetailRespVo.setVariables(appVarListResVos);
        return applicationDetailRespVo;
    }


    public IdRespVo delete(String id) {
        Application application = ResourceUtil.checkResource(baseMapper, id);
        if (Objects.equals(application.getInitFrom(), InitFrom.DOCC.getType()) || Objects.equals(application.getInitFrom(), InitFrom.DOMA.getType()) || Objects.equals(application.getAccountId(), Constant.INNER_ACCOUNT_ID)) {
            throw new BaseException(ResultCode.NO_AUTH.getCode(), ResultCode.NO_AUTH.getMsg());
        }

        Application updateApp = new Application();
        updateApp.setId(id);
        updateApp.setInvalid(1);
        baseMapper.updateById(updateApp);

        // delete component application ref
        LambdaQueryWrapper<ApplicationComponentRef> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(ApplicationComponentRef::getApplicationId, id);
        iApplicationComponentRefService.getBaseMapper().delete(queryWrapper);
        return new IdRespVo(id);
    }

}
