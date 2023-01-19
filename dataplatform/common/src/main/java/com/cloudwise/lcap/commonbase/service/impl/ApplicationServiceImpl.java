package com.cloudwise.lcap.commonbase.service.impl;

import cn.hutool.core.collection.CollectionUtil;
import cn.hutool.core.map.MapUtil;
import cn.hutool.json.JSONArray;
import cn.hutool.json.JSONObject;
import cn.hutool.json.JSONUtil;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.cloudwise.lcap.commonbase.contants.Constant;
import com.cloudwise.lcap.commonbase.dto.PreviewUrlShareDTO;
import com.cloudwise.lcap.commonbase.entity.*;
import com.cloudwise.lcap.commonbase.enums.*;
import com.cloudwise.lcap.commonbase.exception.BaseException;
import com.cloudwise.lcap.commonbase.mapper.ApplicationMapper;
import com.cloudwise.lcap.commonbase.mapper.DataQueryMapper;
import com.cloudwise.lcap.commonbase.mapper.DataTableMapper;
import com.cloudwise.lcap.commonbase.mapper.TradeMapper;
import com.cloudwise.lcap.commonbase.mapstruct.StructUtil;
import com.cloudwise.lcap.commonbase.service.*;
import com.cloudwise.lcap.commonbase.threadlocal.ThreadLocalContext;
import com.cloudwise.lcap.commonbase.util.BusinessUtils;
import com.cloudwise.lcap.commonbase.util.JsonPathUtil;
import com.cloudwise.lcap.commonbase.util.JsonUtils;
import com.cloudwise.lcap.commonbase.vo.*;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

import static java.time.temporal.ChronoUnit.DAYS;

/**
 * <p>
 * 服务实现类
 * </p>
 *
 * @author ethan.du
 * @since 2022-08-01
 */
@Service
@Slf4j
public class ApplicationServiceImpl extends ServiceImpl<ApplicationMapper, Application> implements IApplicationService {
    @Autowired
    IProjectService iProjectService;

    @Autowired
    ITradeService iTradeService;

    @Autowired
    ITagRefService iTagRefService;

    //    @Autowired
//    DoucApiImp doucApiImp;
    @Autowired
    HttpServletRequest request;

    @Autowired
    ITagService iTagService;

    @Autowired
    IAppVarService iAppVarService;

    @Autowired
    IApplicationComponentRefService iApplicationComponentRefService;

    @Autowired
    IApplicationTagRefService iApplicationTagRefService;

    @Autowired
    IProjectTradeRefService iProjectTradeRefService;

    @Autowired
    StructUtil structUtil;

    @Value("${lcap.component.filterId}")
    private String filterComponentId;
    @Value("${lcap.application.default_cover_path}")
    private String defaultApplicationCoverPath;

    @Autowired
    private DataQueryMapper dataQueryMapper;
    @Autowired
    private DataTableMapper dataTableMapper;

    @Autowired
    private TradeMapper tradeMapper;

    @Autowired
    private IComponentService iComponentService;

    @Value("${lcap.component.init_version}")
    private String componentInitVersion;
    @Autowired
    public BaseUserService baseUserService;

    @Override
    public IdRespVo install(ApplicationInstallReqVo installInfo) {
        Long accountId = installInfo.getAccountId() != null ? installInfo.getAccountId() : ThreadLocalContext.getAccountId();
        Long userId = installInfo.getUserId() != null ? installInfo.getUserId() : ThreadLocalContext.getUserId();

        LambdaQueryWrapper<Application> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(Application::getName, installInfo.getName())
                .in(Application::getAccountId, Arrays.asList(accountId, Constant.INNER_ACCOUNT_ID));

        Long aLong = baseMapper.selectCount(queryWrapper);
        if (aLong > 0) {
            throw new BaseException(ResultCode.ALREADY_EXISTS.getCode(), ResultCode.ALREADY_EXISTS.getMsg());
        }

        JSONArray pages = JSONUtil.parseArray("[{" +
                "id: " + UUID.randomUUID() + "," +
                "options: {" +
                "name: '数据可视化大屏幕'," +
                "width: \"" + installInfo.getWidth() + "\"," +
                "height: \"" + installInfo.getHeight() + "\"," +
                "scaleMode: 'width'," +
                "css: '.dv-component{ overflow:unset; }'," +
                "backgroundColor: '#F4F4F4'," +
                "backgroundImage: ''," +
                "backgroundRepeat: " + false + "," +
                "componentApiDomain: ''," +
                "ENVGlobalOptions: {}," +
                "faviconIocImage: ''," +
                "}," +
                "components: []," +
                "dataSources: []," +
                "events: [{" +
                "action: 'callComponentMethod'," +
                "name: 'dodb-params-change'," +
                "options: {" +
                "args: [ 'dodb-params-change' ]," +
                "component: []," +
                "method: 'trigger'," +
                "}," +
                "source: []," +
                "type: 'dodb-params-change'," +
                "}]," +
                "functions: []}]");

        List<MetricsReqVo> metrics = installInfo.getMetrics();
        List<String> componentIds = new ArrayList<>();
        if (metrics != null && metrics.size() > 0) {
            componentIds = metrics.stream().map(MetricsReqVo::getComponentId).distinct().collect(Collectors.toList());
            LambdaQueryWrapper<Component> queryComponentWrapper = new LambdaQueryWrapper<>();
            queryComponentWrapper.in(Component::getId, componentIds);
            List<Component> components = iComponentService.getBaseMapper().selectList(queryComponentWrapper);

            ArrayList<JSONObject> pageComponents = new ArrayList<>();
            for (MetricsReqVo metric : installInfo.getMetrics()) {
                if (components != null) {
                    Optional<Component> curComponent = components.stream().filter(component -> Objects.equals(component.getId(), metric.getComponentId())).findFirst();
                    if (curComponent.isPresent()) {
                        String componentUuid = UUID.randomUUID().toString();
                        String componentId = curComponent.get().getId();
                        String componentLatestVersion = curComponent.get().getLatestVersion() != null ? curComponent.get().getLatestVersion() : componentInitVersion;
                        Number componentIndex = Objects.equals(filterComponentId, componentId) ? 100 : 0;

                        JSONObject jsonObject = JSONUtil.parseObj("{" +
                                "type: \"" + componentId + "\"," +
                                "id: \"" + componentUuid + "\"," +
                                "config: {" +
                                "name: \"" + metric.getName() + "\"," +
                                "left: \"" + metric.getLocation().getX() + "\"," +
                                "top: \"" + metric.getLocation().getY() + "\"," +
                                "width: \"" + metric.getLocation().getWidth() + "\"," +
                                "height: \"" + metric.getLocation().getHeight() + "\"," +
                                "index: \"" + componentIndex + "\"," +
                                "visible: " + true + "," +
                                "}," +
                                "options: {" +
                                "metricName: \"" + metric.getName() + "\"," +
                                "unit: \"" + metric.getUnit() + "\"," +
                                "}," +
                                "connects: {}," +
                                "version: \"" + componentLatestVersion + "\"," +
                                "}");

                        ((JSONObject) jsonObject.getObj("options")).set("metricKey", metric.getKey());
                        jsonObject.set("dataSource", metric.getDataSource());
                        pageComponents.add(jsonObject);
                        if (Objects.equals(filterComponentId, componentId)) {
                            ((JSONObject) (((JSONObject) pages.get(0)).getJSONArray("events").get(0))).getJSONArray("source").add("component::" + componentUuid);
                        } else {
                            ((JSONObject) (((JSONObject) (((JSONObject) pages.get(0)).getJSONArray("events").get(0))).getObj("options"))).getJSONArray("component").add(componentUuid);
                        }
                    }
                }
            }

            ((JSONObject) pages.get(0)).set("components", pageComponents);
        }

        String monitorProjectId;
        LambdaQueryWrapper<Project> projectLambdaQueryWrapper = new LambdaQueryWrapper<>();
        projectLambdaQueryWrapper.eq(Project::getName, Constant.MONITOR_PROJECT_NAME);
        Project monitorProjectInfo = iProjectService.getBaseMapper().selectOne(projectLambdaQueryWrapper);

        LambdaQueryWrapper<Trade> LambdaQueryTradeWrapper = new LambdaQueryWrapper<>();
        LambdaQueryTradeWrapper.eq(Trade::getName, Constant.INNER_TRADES_NAME).eq(Trade::getAccountId, Constant.INNER_ACCOUNT_ID);
        Trade innerTradeInfo = tradeMapper.selectOne(LambdaQueryTradeWrapper);

        if (monitorProjectInfo != null) {
            monitorProjectId = monitorProjectInfo.getId();
        } else {
            TradeVo trade = new TradeVo();
            if (innerTradeInfo != null) {
                trade.setId(innerTradeInfo.getId());
                trade.setName(innerTradeInfo.getName());
            } else {
                trade.setName(Constant.INNER_TRADES_NAME);
            }

            ProjectReqVo project = new ProjectReqVo();
            project.setAccountId(accountId);
            project.setUserId(userId);
            project.setName(Constant.MONITOR_PROJECT_NAME);
            project.setDesc(Constant.MONITOR_PROJECT_DESC);
            project.setTrades(Collections.singletonList(trade));

            IdRespVo insertProjectId = iProjectService.add(project);
            monitorProjectId = insertProjectId.getId();
        }

        Application application = new Application();

        application.setAccountId(accountId);
        application.setUpdater(userId);
        application.setCreator(userId);

        application.setName(installInfo.getName());
        application.setDevelopStatus(ComponentDevStatus.DOING.getType());
        application.setPages(JSONUtil.toJsonStr(pages));
        application.setModelId(installInfo.getModelId());
        application.setModels(JSONUtil.toJsonStr(installInfo.getModels()));
        application.setType(installInfo.getType());
        application.setProjectId(monitorProjectId);
        application.setIsLib(installInfo.getIsLib() != null ? (installInfo.getIsLib() ? 1 : 0) : 0);
        application.setInitFrom(installInfo.getIsLib() != null
                ? (installInfo.getIsLib() ? InitFrom.DOCC.getType() : InitFrom.DOMA.getType()) : InitFrom.DOMA.getType());
        application.setCover(defaultApplicationCoverPath);
        baseMapper.insert(application);

        // add component application ref
        if (componentIds.size() > 0) {
            List<ApplicationComponentRef> addApplicationComponentRefs = componentIds.stream().map(c -> {
                ApplicationComponentRef applicationComponentRef = new ApplicationComponentRef();
                applicationComponentRef.setApplicationId(application.getId());
                applicationComponentRef.setComponentId(c);
                return applicationComponentRef;
            }).collect(Collectors.toList());
            iApplicationComponentRefService.saveBatch(addApplicationComponentRefs);
        }

        return new IdRespVo(application.getId());
    }

    @Override
    public void editBasicInfo(String id, ApplicationBasicInfoReqVo basicInfo) {
        Long accountId = ThreadLocalContext.getAccountId();
        Application application = baseMapper.selectById(id);
        Project project = iProjectService.getBaseMapper().selectById(application.getProjectId());
        // 来自DOCC的大屏不可编辑
        if (Objects.equals(project.getInitFrom(), InitFrom.DOCC.getType())) {
            throw new BaseException(ResultCode.NO_AUTH.getCode(), ResultCode.NO_AUTH.getMsg());
        }

        // 内置组件不可编辑，一种情况例外：可以推荐
        if (Objects.equals(application.getAccountId(), Constant.INNER_ACCOUNT_ID)
                && basicInfo.getIsRecommend() == null) {
            throw new BaseException(ResultCode.NO_AUTH.getCode(), ResultCode.NO_AUTH.getMsg());
        }

        Application newApplication = new Application();
        newApplication.setId(id);

        String name = basicInfo.getName();
        Integer deleted = basicInfo.getDeleted();
        String type = basicInfo.getType();
        String projectId = basicInfo.getProjectId();
        String developStatus = basicInfo.getDevelopStatus();
        Boolean isRecommend = basicInfo.getIsRecommend();
        List<TagVo> tags = basicInfo.getTags();
        if (name != null) {
            LambdaQueryWrapper<Application> queryWrapper = new LambdaQueryWrapper<>();
            queryWrapper.eq(Application::getName, name).ne(Application::getId, id).in(Application::getAccountId,
                    Arrays.asList(accountId, Constant.INNER_ACCOUNT_ID));

            Long count = baseMapper.selectCount(queryWrapper);
            if (count > 0) {
                throw new BaseException(ResultCode.ALREADY_EXISTS.getCode(), ResultCode.ALREADY_EXISTS.getMsg());
            }

            newApplication.setName(name);
        }
        newApplication.setInvalid(deleted);
        newApplication.setType(type);
        newApplication.setProjectId(projectId);
        newApplication.setDevelopStatus(developStatus);
        if (isRecommend != null) {
            newApplication.setIsRecommend(isRecommend ? ValidType.VALID.getType() : ValidType.INVALID.getType());
        }

        if (tags != null && tags.size() > 0) {
            iTagRefService.updateTagsRef(id, tags, ResourceType.APPLICATION.getType());
        } else {
            iTagRefService.deleteTagsRef(id, ResourceType.APPLICATION.getType());
        }
        baseMapper.updateById(newApplication);
    }

    @Override
    public void editDesignInfo(String id, ApplicationDesignInfoReqVo designInfo) {
        Application application = baseMapper.selectById(id);
        Project project = iProjectService.getBaseMapper().selectById(application.getProjectId());

        // 来自DOCC的大屏不可编辑
        if (Objects.equals(project.getInitFrom(), InitFrom.DOCC.getType())) {
            throw new BaseException(ResultCode.NO_AUTH.getCode(), ResultCode.NO_AUTH.getMsg());
        }

        // 内置组件不可编辑
        if (Objects.equals(application.getAccountId(), Constant.INNER_ACCOUNT_ID)) {
            throw new BaseException(ResultCode.NO_AUTH.getCode(), ResultCode.NO_AUTH.getMsg());
        }

        ArrayList<String> newComponentIds = new ArrayList<>();
        ArrayList<String> pageIds = new ArrayList<>();
        List<JSONObject> pages = designInfo.getPages();
        BusinessUtils.renderPagesConfig(pages);
        for (JSONObject jsonPage : pages) {
            pageIds.add(jsonPage.getStr("id"));

            List<JSONObject> components = jsonPage.getBeanList("components", JSONObject.class);
            if (CollectionUtil.isNotEmpty(components)) {
                for (JSONObject jsonComponent : components) {
                    String componentId = jsonComponent.getStr("type");
                    newComponentIds.add(componentId);
                    if (InitFrom.DOCC.getType().equals(application.getInitFrom())
                            && !componentId.equals(filterComponentId)
                            && JsonPathUtil.transfer(JSONUtil.toJsonStr(jsonComponent), "$.dataSource.options.customOptions.ciInfo") == null) {
                        throw new BaseException(ResultCode.ARGUMENT_NOT_VALID.getCode(), "资源ci必传");
                    }
                }
            }
        }

        // 大屏变量处理
        if (CollectionUtil.isNotEmpty(designInfo.getVariables())) {
            List<AppVarReqVo> variables = designInfo.getVariables();
            for (AppVarReqVo variable : variables) {
                variable.setAppId(id);
            }
            iAppVarService.deleteVarsByAppId(id);
            iAppVarService.batchCreateAppVar(variables);
        }

        Application updateApplication = new Application();
        updateApplication.setId(id);
        updateApplication.setPages(JSONUtil.toJsonStr(designInfo.getPages()));
        baseMapper.updateById(updateApplication);

        List<String> oldComponentIds = (List<String>) JsonPathUtil.transfer(application.getPages(), "$.[*].components[*].type");

        List<String> addComponentIds = newComponentIds.stream().filter(c -> !oldComponentIds.contains(c)).collect(Collectors.toList());
        List<String> deleteComponentIds = oldComponentIds.stream().filter(c -> !newComponentIds.contains(c)).collect(Collectors.toList());

        if (addComponentIds.size() > 0) {
            List<ApplicationComponentRef> addApplicationComponentRefs = addComponentIds.stream().map(c -> {
                ApplicationComponentRef applicationComponentRef = new ApplicationComponentRef();
                applicationComponentRef.setApplicationId(id);
                applicationComponentRef.setComponentId(c);
                return applicationComponentRef;
            }).collect(Collectors.toList());
            iApplicationComponentRefService.saveBatch(addApplicationComponentRefs);
        }

        if (deleteComponentIds.size() > 0) {
            ApplicationComponentRef deleteApplicationComponentRef = new ApplicationComponentRef();
            deleteApplicationComponentRef.setDeleted(ValidType.VALID.getType());
            LambdaQueryWrapper<ApplicationComponentRef> deleteQueryWrapper = new LambdaQueryWrapper<>();
            deleteQueryWrapper.eq(ApplicationComponentRef::getApplicationId, id)
                    .in(ApplicationComponentRef::getComponentId, deleteComponentIds);
            iApplicationComponentRefService.update(deleteApplicationComponentRef, deleteQueryWrapper);
        }

        // 移除已删除的page相关的变量
        LambdaQueryWrapper<AppVar> deleteAppVarWrapper = new LambdaQueryWrapper<>();
        deleteAppVarWrapper.eq(AppVar::getAppId, id).notIn(AppVar::getPageId, pageIds);
        iAppVarService.getBaseMapper().delete(deleteAppVarWrapper);
    }


    @Override
    public PageBaseListRespVo list(ApplicationListReqVo queryInfo) {
        PageBaseListRespVo pageBaseListRespVo = new PageBaseListRespVo();
        pageBaseListRespVo.setTotal(0L);
        pageBaseListRespVo.setPageSize(queryInfo.getPageSize());
        pageBaseListRespVo.setCurPage(queryInfo.getCurPage());
        pageBaseListRespVo.setList(new ArrayList<>());

        Long accountId = ThreadLocalContext.getAccountId();
        Page<Application> page = new Page<>(queryInfo.getCurPage(), queryInfo.getPageSize());

        LambdaQueryWrapper<Application> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.in(Application::getAccountId, Arrays.asList(accountId, Constant.INNER_ACCOUNT_ID));

        Integer deleted = queryInfo.getDeleted();
        String name = queryInfo.getName();
        String developStatus = queryInfo.getDevelopStatus();
        String projectId = queryInfo.getProjectId();
        String type = queryInfo.getType();
        Boolean isLib = queryInfo.getIsLib();
        Boolean isRecommend = queryInfo.getIsRecommend();
        List<String> reqTags = queryInfo.getTags();
        List<String> trades = queryInfo.getTrades();
        List<String> searchAppIds = null;

        if (name != null) {
            //queryWrapper.like(Application::getName, name).or();
            queryWrapper.and(wrapper -> wrapper.like(Application::getName, name).or().eq(Application::getId, name));
        }
        if (deleted != null) {
            queryWrapper.eq(Application::getInvalid, deleted);
        } else {
            queryWrapper.eq(Application::getInvalid, 0);
        }
        if (developStatus != null) {
            queryWrapper.eq(Application::getDevelopStatus, developStatus);
        }
        if (projectId != null) {
            queryWrapper.eq(Application::getProjectId, projectId);
        }
        if (type != null) {
            queryWrapper.eq(Application::getType, type);
        }
        if (isLib != null) {
            queryWrapper.eq(Application::getIsLib, isLib);
        }
        if (isRecommend != null) {
            queryWrapper.eq(Application::getIsRecommend, isRecommend);
        }
        if (reqTags != null && reqTags.size() > 0) {
            LambdaQueryWrapper<ApplicationTagRef> atrWrapper = new LambdaQueryWrapper<>();
            atrWrapper.in(ApplicationTagRef::getTagId, reqTags);
            List<ApplicationTagRef> applicationTagRefs = iApplicationTagRefService.getBaseMapper().selectList(atrWrapper);
            searchAppIds = applicationTagRefs.stream().map(ApplicationTagRef::getApplicationId).distinct().collect(Collectors.toList());
            if (searchAppIds.size() == 0) {
                return pageBaseListRespVo;
            }
            queryWrapper.in(Application::getId, searchAppIds);
        }
        if (trades != null && trades.size() > 0) {
            LambdaQueryWrapper<ProjectTradeRef> ptrWrapper = new LambdaQueryWrapper<>();
            ptrWrapper.in(ProjectTradeRef::getTradeId, trades);
            List<ProjectTradeRef> ptrList = iProjectTradeRefService.getBaseMapper().selectList(ptrWrapper);
            List<String> projectIds = ptrList.stream().map(ProjectTradeRef::getProjectId).distinct().collect(Collectors.toList());
            if (projectIds.size() == 0) {
                return pageBaseListRespVo;
            }
            queryWrapper.in(Application::getProjectId, projectIds);
        }

        queryWrapper.orderByDesc(Application::getUpdateTime);
        Page<Application> applicationPage = baseMapper.selectPage(page, queryWrapper);
        List<Application> applicationList = applicationPage.getRecords();
        ArrayList<ApplicationListRespVo> applicationListResVos = new ArrayList<>();
        if (!applicationList.isEmpty()) {
            List<String> appIds = applicationList.stream().map(Application::getId).collect(Collectors.toList());
            LambdaQueryWrapper<ApplicationTagRef> appWrapper = new LambdaQueryWrapper<>();
            appWrapper.in(ApplicationTagRef::getApplicationId, appIds);
            List<ApplicationTagRef> tagRefs = iApplicationTagRefService.getBaseMapper().selectList(appWrapper);
            List<String> tagIds = tagRefs.stream().map(ApplicationTagRef::getTagId).collect(Collectors.toList());

            Map<String, TagVo> tagMap = new HashMap<>();
            if (tagIds.size() > 0) {
                LambdaQueryWrapper<Tag> tagWrapper = new LambdaQueryWrapper<>();
                tagWrapper.in(Tag::getId, tagIds);
                List<Tag> tags = iTagService.getBaseMapper().selectList(tagWrapper);
                tags.forEach(t -> {
                    String tagId = t.getId();
                    tagMap.put(tagId, structUtil.convertTagVo(t));
                });
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

            List<String> projectIds = applicationList.stream().map(Application::getProjectId).distinct().collect(Collectors.toList());
            LambdaQueryWrapper<Project> projectLambdaQueryWrapper = new LambdaQueryWrapper<>();
            projectLambdaQueryWrapper.in(Project::getId, projectIds);
            List<Project> projects = iProjectService.getBaseMapper().selectList(projectLambdaQueryWrapper);
            HashMap<String, Project> projectMap = new HashMap<>();
            projects.forEach(p -> {
                String pId = p.getId();
                projectMap.put(pId, p);
            });

            HashSet<Long> users = new HashSet<>();
            applicationList.forEach(app -> {
                users.add(app.getCreator());
                users.add(app.getUpdater());
            });
//            List<JSONObject> userInfos = doucApiImp.getUserInfoByIds(new ArrayList<>(users));
            HashMap<Long, String> userMap = new HashMap<>();
//            userInfos.forEach(u -> {
//                userMap.put(Long.parseLong(u.getStr("userId")), u.getStr("userAlias"));
//            });

            applicationList.forEach(app -> {
                ApplicationListRespVo applicationListRespVo = structUtil.convertApplicationListResVo(app);
                Project project = projectMap.get(app.getProjectId());
                ProjectRespVo projectRespVo = structUtil.convertProjectRespVo(project);
                applicationListRespVo.setProjects(projectRespVo != null ? projectRespVo : new ProjectRespVo());
                applicationListRespVo.setTags(appTagMap.get(app.getId()) != null ? appTagMap.get(app.getId()) : new ArrayList<>());
//                applicationListRespVo.setCreator(userMap.get(app.getCreator()));
//                applicationListRespVo.setUpdater(userMap.get(app.getUpdater()));
                applicationListRespVo.setCreator(getUserName(app.getCreator()));
                applicationListRespVo.setUpdater(getUserName(app.getUpdater()));
                applicationListRespVo.setCover(app.getCover());
                applicationListResVos.add(applicationListRespVo);
            });
        }

        pageBaseListRespVo.setCurPage(queryInfo.getCurPage());
        pageBaseListRespVo.setPageSize(queryInfo.getPageSize());
        pageBaseListRespVo.setTotal(applicationPage.getTotal());
        pageBaseListRespVo.setList(applicationListResVos);
        return pageBaseListRespVo;
    }

    private String getUserName(Long userId) {
        //doucApi 获取用户信息
        if (null == userId) {
            return null;
        }
        BaseUser byId = baseUserService.getById(userId);
        if (byId != null) {
            return byId.getUsername();
        } else {
            return "-";
        }
    }


    @Override
    public Long getApplicationsCount(ApplicationListReqVo reqInfo) {
        Long accountId = ThreadLocalContext.getAccountId();
        LambdaQueryWrapper<Application> lambdaQueryWrapper = new LambdaQueryWrapper<>();
        lambdaQueryWrapper.eq(Application::getInvalid, ValidType.INVALID.getType());
        lambdaQueryWrapper.in(Application::getAccountId, Arrays.asList(accountId, Constant.INNER_ACCOUNT_ID));

        if (reqInfo.getIsLib() != null) {
            lambdaQueryWrapper.eq(Application::getIsLib, reqInfo.getIsLib());
        }
        return baseMapper.selectCount(lambdaQueryWrapper);
    }


    /**
     * TODO
     * 分享预览地址
     *
     * @param applicationId 大屏id
     * @return
     */
    @Override
    public PreviewUrlShareDTO generatorSharePreviewUrl(String applicationId) {
        //TODO
        //Map<String, Object> sharePreviewUrlInfo = redisUtils.hmget(applicationSharePrefix + applicationId, false);
        Map<String, Object> sharePreviewUrlInfo = new HashMap<>();
        if (MapUtil.isNotEmpty(sharePreviewUrlInfo)) {
            return new JSONObject(sharePreviewUrlInfo).toBean(PreviewUrlShareDTO.class);
        }

        long expireTime = Instant.now().plus(365L * 20, DAYS).toEpochMilli();
        String shareKey = getRandomChars();
        PreviewUrlShareDTO previewUrlShareDTO = PreviewUrlShareDTO.builder().userId(ThreadLocalContext.getUserId()).accountId(ThreadLocalContext.getAccountId())
                .applicationId(applicationId).expireType(1).shareTime(Instant.now().toEpochMilli()).expireTime(expireTime)
                .shareStatus(1).shareKey(shareKey).build();

        // 1. 解析大屏配置的组件引用的数据查询和http查询的设置，进行接口授权
        Application application = baseMapper.selectById(applicationId);
        updateAuthedApiInfo(applicationId, application.getPages());

        return previewUrlShareDTO;
    }

    /**
     * 大屏内部使用的组件引用的api进行appKey授权更新
     */
    public void updateAuthedApiInfo(String applicationId, String pages) {
        //TODO
        // Map<String, Object> sharePreviewUrlInfo = redisUtils.hmget(applicationSharePrefix + applicationId, false);
        Map<String, Object> sharePreviewUrlInfo = new HashMap<>();
        if (MapUtil.isNotEmpty(sharePreviewUrlInfo)) {
            Map<String, Object> authStatusData = new HashMap<>();
            authStatusData.put("status", 1);
            authStatusData.put("authType", 2);
            authStatusData.put("expireTime", sharePreviewUrlInfo.get("expireTime"));
            authStatusData.put("accountId", ThreadLocalContext.getAccountId());

            List<JSONObject> pageList = JsonUtils.parseArray(pages, JSONObject.class);

            Map<String, Map<String, Object>> authInfoMap = new HashMap<>();
            for (JSONObject page : pageList) {
                List<JSONObject> components = page.getBeanList("components", JSONObject.class);
                if (CollectionUtil.isNotEmpty(components)) {
                    for (JSONObject component : components) {
                        JSONObject dataSource = component.getJSONObject("dataSource");
                        JSONObject options = dataSource.getJSONObject("options");
                        String dataSourceType = dataSource.getStr("type");
                        if ("http".equalsIgnoreCase(dataSourceType)) {
                            String url = options.getStr("url");
                            if (StringUtils.isNotBlank(url) && url.contains("/gateway")) {
                                if (url.contains("?")) {
                                    url = url.substring(0, url.indexOf("?"));
                                }
                                authInfoMap.put(url, authStatusData);
                            }
                        } else if ("dataSearch".equalsIgnoreCase(dataSourceType)) {
                            String dataQueryId = options.getStr("dataSearch");
                            DataQuery dataQuery = dataQueryMapper.selectById(dataQueryId);

                            List<String> tableIds = new ArrayList<>();
                            if (dataQuery.getQueryType() == 1 && dataQuery.getTableId().matches("[0-9]+")) {// 简单查询
                                tableIds.add(dataQuery.getTableId());
                            } else {// 复合查询
                                JSONObject setting = new JSONObject(dataQuery.getSetting());
                                List<String> combineIds = setting.getBeanList("combineIds", String.class);
                                if (CollectionUtil.isNotEmpty(combineIds)) {
                                    List<DataQuery> dataQueries = dataQueryMapper.selectBatchIds(combineIds);
                                    for (DataQuery query : dataQueries) {
                                        if (query.getQueryType() == 1 && query.getTableId().matches("[0-9]+")) {
                                            tableIds.add(dataQuery.getTableId());
                                        }
                                    }
                                }
                            }
                            if (CollectionUtil.isNotEmpty(tableIds)) {
                                List<DataTable> dataTables = dataTableMapper.queryDataSourceAndTable(tableIds);
                                for (DataTable dataTable : dataTables) {
                                    JSONObject meta = new JSONObject(dataTable.getMeta());
                                    String url = meta.getStr("url");
                                    if (url.contains("/gateway")) {
                                        url = url.substring(0, url.indexOf("?"));
                                        authInfoMap.put(url, authStatusData);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    private final static String[] chars = new String[]{"a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m",
            "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "0", "1", "2", "3", "4", "5", "6", "7", "8",
            "9", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U",
            "V", "W", "X", "Y", "Z"};

    private static String getRandomChars() {
        StringBuilder shortBuffer = new StringBuilder();
        // 获取用户id进行字符串截取
        String uuid = UUID.randomUUID().toString().replace("-", "");
        uuid += uuid;
        for (int i = 0; i < 16; i++) {
            String str = uuid.substring(i, i + 4);
            int x = Integer.parseInt(str, 24);
            shortBuffer.append(chars[x % 0x3E]);
        }
        return shortBuffer.toString();
    }

    public static Map<String, Object> authStatusData(Long expireTime, Long accountId) {
        Map<String, Object> authStatusData = new HashMap<>();
        authStatusData.put("status", 1);
        authStatusData.put("authType", 2);
        authStatusData.put("expireTime", expireTime);
        authStatusData.put("accountId", accountId);

        return authStatusData;
    }
}
