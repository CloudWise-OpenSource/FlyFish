package com.cloudwise.lcap.commonbase.service.impl;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.collection.CollectionUtil;
import cn.hutool.core.collection.ListUtil;
import cn.hutool.core.date.DateUtil;
import cn.hutool.core.io.FileUtil;
import cn.hutool.core.io.file.FileReader;
import cn.hutool.core.util.StrUtil;
import cn.hutool.core.util.ZipUtil;
import cn.hutool.json.JSONObject;
import cn.hutool.json.JSONUtil;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.cloudwise.lcap.commonbase.contants.Constant;
import com.cloudwise.lcap.commonbase.entity.*;
import com.cloudwise.lcap.commonbase.enums.ComponentDevStatus;
import com.cloudwise.lcap.commonbase.enums.ComponentType;
import com.cloudwise.lcap.commonbase.enums.ResourceType;
import com.cloudwise.lcap.commonbase.enums.ResultCode;
import com.cloudwise.lcap.commonbase.exception.BaseException;
import com.cloudwise.lcap.commonbase.mapper.ApplicationMapper;
import com.cloudwise.lcap.commonbase.mapper.ComponentMapper;
import com.cloudwise.lcap.commonbase.mapstruct.StructUtil;
import com.cloudwise.lcap.commonbase.service.*;
import com.cloudwise.lcap.commonbase.threadlocal.ThreadLocalContext;
import com.cloudwise.lcap.commonbase.util.CommandUtils;
import com.cloudwise.lcap.commonbase.util.FileUtils;
import com.cloudwise.lcap.commonbase.util.JsonUtils;
import com.cloudwise.lcap.commonbase.util.ResourceUtil;
import com.cloudwise.lcap.commonbase.vo.*;
import com.google.common.collect.Lists;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.eclipse.jgit.api.AddCommand;
import org.eclipse.jgit.api.CommitCommand;
import org.eclipse.jgit.api.Git;
import org.eclipse.jgit.api.Status;
import org.eclipse.jgit.api.errors.GitAPIException;
import org.eclipse.jgit.diff.DiffEntry;
import org.eclipse.jgit.diff.DiffFormatter;
import org.eclipse.jgit.internal.storage.file.FileRepository;
import org.eclipse.jgit.lib.ObjectId;
import org.eclipse.jgit.lib.ObjectReader;
import org.eclipse.jgit.lib.Repository;
import org.eclipse.jgit.revwalk.RevCommit;
import org.eclipse.jgit.treewalk.CanonicalTreeParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.net.URLEncoder;
import java.nio.charset.Charset;
import java.nio.file.Files;
import java.util.*;
import java.util.stream.Collectors;

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
public class ComponentServiceImpl extends ServiceImpl<ComponentMapper, Component> implements
        IComponentService {

    @Value("${portal_web_path}")
    private String portalWebPath;
    @Value("${lcap.component.init_version}")
    private String componentInitVersion;
    @Value("${lcap_www_path}")
    private String lcap_www_path;
    @Value("${lcap.component.path}")
    private String componentBasePath;
    @Value("${lcap.component.tpl_path}")
    private String componentTplPath;
    @Value("${lcap.component.common_path}")
    private String commonPath;
    @Value("${lcap.component.tmp_path}")
    private String tmpPath;
    @Value("${lcap.component.web_path}")
    private String webPath;
    @Value("${lcap_www_relative_path}")
    private String wwwRelativePath;
    @Value("${lcap_component_relative_path}")
    private String componentRelativePath;
    @Value("${lcap.component.default_cover_path}")
    private String defaultCoverPath;
    @Value("${lcap.component.git_enable:false}")
    private Boolean gitEnable;
    @Value("${lcap.component.git_username:admin}")
    private String gitUsername;
    @Value("${lcap.component.git_email:a123}")
    private String gitEmail;


    @Autowired
    private IProjectTradeRefService iProjectTradeRefService;

    @Autowired
    private IProjectService iProjectService;

    @Autowired
    private ITagService iTagService;

    @Autowired
    private StructUtil structUtil;

    @Autowired
    HttpServletRequest request;
    @Autowired
    public BaseUserService baseUserService;
    @Autowired
    private IComponentVersionService iComponentVersionService;


    @Autowired
    private IComponentTagRefService iComponentTagRefService;

    @Autowired
    private IComponentProjectRefService iComponentProjectRefService;

    @Autowired
    IApplicationComponentRefService iApplicationComponentRefService;

    @Autowired
    ApplicationMapper applicationMapper;

    @Autowired
    ITagRefService iTagRefService;

//    @Autowired
//    DoucApiImp doucApiImp;

    @Autowired
    IProjectRefService iProjectRefService;


    @Autowired
    IComponentCategoryService iComponentCategoryService;

    @Autowired
    IApplicationService iApplicationService;

    @Autowired
    ComponentProjectRefServiceImpl componentProjectRefService;


    @Override
    public PageBaseListRespVo getComponentHistory(String id, Integer curPage, Integer pageSize) {
        File gitFile = new File(componentBasePath + File.separator + id + File.separator + componentInitVersion + "/.git");
        Long total = 0L;
        List<ComponentGitHistoryVo> list = new ArrayList<>();

        PageBaseListRespVo pageBaseListRespVo = new PageBaseListRespVo();
        if (gitFile.exists()) {
            try (Repository repo = new FileRepository(gitFile)) {
                Git git = new Git(repo);

                Iterable<RevCommit> gitCommits = git.log().call();
                List<RevCommit> revCommits = Lists.newArrayList(gitCommits);
                revCommits = revCommits.subList(0, revCommits.size() - 1);
                List<RevCommit> returnCommits = revCommits.subList((curPage - 1) * pageSize, Math.min(curPage * pageSize, revCommits.size()));

                for (RevCommit commit : returnCommits) {
                    total++;
                    ComponentGitHistoryVo componentGitHistoryVo = new ComponentGitHistoryVo();
                    componentGitHistoryVo.setHash(commit.getId().name());
                    componentGitHistoryVo.setMessage(commit.getFullMessage());
                    componentGitHistoryVo.setTime(commit.getAuthorIdent().getWhen().getTime());

                    list.add(componentGitHistoryVo);
                }
            } catch (GitAPIException | IOException e) {
                throw new RuntimeException(e);
            }
        }

        pageBaseListRespVo.setCurPage(curPage);
        pageBaseListRespVo.setPageSize(pageSize);
        pageBaseListRespVo.setTotal(total);
        pageBaseListRespVo.setList(list);
        return pageBaseListRespVo;
    }


    @Override
    public IdRespVo installComponentDepend(String id) {
        Component componentInfo = ResourceUtil.checkResource(baseMapper, id);
        if (Objects.equals(componentInfo.getAccountId(), Constant.INNER_ACCOUNT_ID)) {
            throw new BaseException(ResultCode.NO_AUTH.getCode(), ResultCode.NO_AUTH.getMsg());
        }

        String componentPath = componentBasePath + File.separator + id;
        String componentDevPath = componentPath + File.separator + componentInitVersion;
        if (!new File(componentDevPath).exists()) {
            log.error("dir not exists: {}", componentDevPath);
            throw new BaseException(ResultCode.DIR_NOT_FOUND.getCode(), ResultCode.DIR_NOT_FOUND.getMsg());
        }

        try {
            String npmRunBuildCommand = String.format("cd %s && NODE_ENV=sit npm i", componentDevPath);
            CommandUtils.exec(npmRunBuildCommand);
        } catch (RuntimeException e) {
            log.error("{} install component depend fail: {}", id, e.getMessage(), e);
            throw new BaseException(ResultCode.INSTALL_DEPEND_FAIL.getCode(), ResultCode.INSTALL_DEPEND_FAIL.getMsg());
        }

        return new IdRespVo(id);
    }

    @Override
    public IdRespVo compileComponent(String id) {
        Component componentInfo = ResourceUtil.checkResource(baseMapper, id);
        if (Objects.equals(componentInfo.getAccountId(), Constant.INNER_ACCOUNT_ID)) {
            throw new BaseException(ResultCode.NO_AUTH.getCode(), ResultCode.NO_AUTH.getMsg());
        }

        String componentPath = componentBasePath + File.separator + id;
        String componentDevPath = componentPath + File.separator + componentInitVersion;
        String componentNodeModulesPath = componentDevPath + File.separator + "node_modules";
        String componentPackagePath = componentDevPath + File.separator + "package.json";
        if (!new File(componentDevPath).exists()) {
            throw new BaseException(ResultCode.DIR_NOT_FOUND.getCode(), ResultCode.DIR_NOT_FOUND.getMsg());
        }

        FileReader fileReader = new FileReader(componentPackagePath);
        JSONObject jsonObject = JSONUtil.parseObj(fileReader.readString());
        if ((((JSONObject) jsonObject.get("dependencies")).size() > 0 || ((JSONObject) jsonObject.get("devDependencies")).size() > 0) && !new File(componentNodeModulesPath).exists()) {
            throw new BaseException(ResultCode.NOT_INSTALL_DEPEND.getCode(), ResultCode.NOT_INSTALL_DEPEND.getMsg());
        }

        try {
            String npmRunBuildCommand = String.format("cd %s && npm run build-dev", componentDevPath);
            CommandUtils.exec(npmRunBuildCommand);
        } catch (RuntimeException e) {
            log.error("{} compile component fail: {}", id, e.getMessage(), e);
            throw new BaseException(ResultCode.COMPILE_FAIL.getCode(), ResultCode.COMPILE_FAIL.getMsg());
        }

        if (gitEnable) {
            gitPush(id, componentDevPath);
        }


        return new IdRespVo(id);
    }

    @Override
    public void delete(String id) {
        Component componentInfo = ResourceUtil.checkResource(baseMapper, id);
        if (Objects.equals(componentInfo.getAccountId(), Constant.INNER_ACCOUNT_ID)) {
            throw new BaseException(ResultCode.NO_AUTH.getCode(), ResultCode.NO_AUTH.getMsg());
        }

        LambdaQueryWrapper<ApplicationComponentRef> refServiceLambdaQueryWrapper = new LambdaQueryWrapper<>();
        refServiceLambdaQueryWrapper.eq(ApplicationComponentRef::getComponentId, id);
        ApplicationComponentRef applicationComponentRef = iApplicationComponentRefService.getBaseMapper().selectOne(refServiceLambdaQueryWrapper);
        if (applicationComponentRef != null) {
            throw new BaseException(ResultCode.EXISTS_ALREADY_COMPONENT_REF.getCode(),
                    ResultCode.EXISTS_ALREADY_COMPONENT_REF.getMsg());
        }
        baseMapper.deleteById(id);
        iComponentProjectRefService.deleteComponentProjectRefByComponentId(id);
        iComponentTagRefService.delComponentTagRefsByComponentId(id);

        if (id.length() > 0) {
            FileUtil.del(componentBasePath + "/" + id);
        }
    }

    @Override
    public PageBaseListRespVo getList(ComponentListReqVo componentListReqVo) {
        PageBaseListRespVo pageBaseListRespVo = PageBaseListRespVo.builder().total(0L).pageSize(componentListReqVo.getPageSize()).curPage(componentListReqVo.getCurPage()).list(new ArrayList()).build();

        Long accountId = ThreadLocalContext.getAccountId();
        LambdaQueryWrapper<Component> componentLambdaQueryWrapper = new LambdaQueryWrapper<>();
        componentLambdaQueryWrapper.in(Component::getAccountId, Arrays.asList(accountId, Constant.INNER_ACCOUNT_ID));

        String key = componentListReqVo.getKey();
        if (StringUtils.isNotEmpty(key)) {
            if (componentListReqVo.getIsLib() != null && componentListReqVo.getIsLib()) {
                componentLambdaQueryWrapper.and(i -> i.like(Component::getDesc, key).or().like(Component::getName, key).or().eq(Component::getId, key));
            } else {
                List<String> componentIds = iComponentTagRefService.getComponentIdsByTagName(key);
                componentLambdaQueryWrapper.and(i -> i.like(Component::getDesc, key).or().in(!componentIds.isEmpty(), Component::getId, componentIds).or().eq(Component::getId, key));
            }
        }

        String name = componentListReqVo.getName();
        if (StringUtils.isNotEmpty(name)) {
            componentLambdaQueryWrapper.and(wrapper -> wrapper.like(Component::getName, name).or().eq(Component::getId, name));
        }
        if (StringUtils.isNotBlank(componentListReqVo.getCreator())) {
            componentLambdaQueryWrapper.eq(Component::getCreator, componentListReqVo.getCreator());
        }
        componentLambdaQueryWrapper.eq(StringUtils.isNotEmpty(componentListReqVo.getCategory()), Component::getCategoryId, componentListReqVo.getCategory());
        componentLambdaQueryWrapper.eq(StringUtils.isNotEmpty(componentListReqVo.getSubCategory()), Component::getSubCategoryId, componentListReqVo.getSubCategory());
        componentLambdaQueryWrapper.eq(StringUtils.isNotEmpty(componentListReqVo.getDevelopStatus()), Component::getDevelopStatus, componentListReqVo.getDevelopStatus());
        componentLambdaQueryWrapper.eq(StringUtils.isNotEmpty(componentListReqVo.getType()), Component::getType, componentListReqVo.getType());
        if (componentListReqVo.getTags() != null && !componentListReqVo.getTags().isEmpty()) {
            List<String> componentIds = iComponentTagRefService.getComponentIdsByTagIds(componentListReqVo.getTags());
            if (componentIds.isEmpty()) {
                return pageBaseListRespVo;
            }
            componentLambdaQueryWrapper.in(Component::getId, componentIds);
        }

        if (componentListReqVo.getIsLib() != null) {
            componentLambdaQueryWrapper.orderByDesc(Component::getCreateTime);
            componentLambdaQueryWrapper.eq(Component::getIsLib, Boolean.TRUE.equals(componentListReqVo.getIsLib()) ? 1 : 0);
        }

        List<String> projectIds = new ArrayList<>();
        if (componentListReqVo.getProjectId() != null) {
            projectIds.add(componentListReqVo.getProjectId());
        }
        if (componentListReqVo.getTrades() != null && !componentListReqVo.getTrades().isEmpty()) {
            List<String> tradeRefProjectIds = iProjectTradeRefService.getProjectIdByTradeIds(componentListReqVo.getTrades());
            if (tradeRefProjectIds.isEmpty()) {
                return pageBaseListRespVo;
            }
            projectIds.addAll(tradeRefProjectIds);
        }

        if (!projectIds.isEmpty()) {
            List<String> componentIds = iComponentProjectRefService.getComponentIdsByProjectIds(projectIds);
            if (componentIds.isEmpty()) {
                return pageBaseListRespVo;
            }
            componentLambdaQueryWrapper.in(Component::getId, componentIds);
        }

        Page<Component> page = new Page<>(componentListReqVo.getCurPage(), componentListReqVo.getPageSize());

        componentLambdaQueryWrapper.orderByDesc(Component::getUpdateTime);
        Page<Component> componentPage = baseMapper.selectPage(page, componentLambdaQueryWrapper);
        List<Component> componentList = componentPage.getRecords();
        List<ComponentRespVo> componentListRespVoList = new ArrayList<>();

        if (componentList != null && !componentList.isEmpty()) {
            List<Long> userIds = componentList.stream().map(Component::getCreator).filter(Objects::nonNull).distinct().collect(Collectors.toList());
            List<BaseUser> usersInfo = baseUserService.list(Wrappers.<BaseUser>lambdaQuery().in(CollUtil.isNotEmpty(userIds),BaseUser::getId, userIds));

            List<String> componentIds = componentList.stream().map(Component::getId).collect(Collectors.toList());
            Map<String, List<Project>> componentIdProjectMap = getProjectsByComponentIds(componentIds);
            Map<String, List<Tag>> componentIdTagMap = getTradesByComponentIds(componentIds);

            componentList.forEach(i -> {
                ComponentRespVo componentRespVo = ComponentRespVo.dtoToBean(i);
                String creator = StrUtil.str(i.getCreator(), (Charset) null);
                Optional<BaseUser> first = usersInfo.stream().filter(user -> Objects.equals(user.getId(), creator)).findFirst();

                List<ProjectRespVo> projectRespVos = new ArrayList<>();
                if ("project".equalsIgnoreCase(componentRespVo.getType())) {
                    List<Project> projects = componentIdProjectMap.get(i.getId());
                    if (CollectionUtil.isNotEmpty(projects)) {
                        projectRespVos = structUtil.convertProjectsRespVo(projects);
                    }
                }
                componentRespVo.setProjects(projectRespVos);

                List<Tag> tags = componentIdTagMap.get(i.getId());
                List<TagVo> tagVos = new ArrayList<>();
                if (CollectionUtil.isNotEmpty(tags)) {
                    tagVos = structUtil.convertTagsRespVo(tags);
                }
                componentRespVo.setTags(tagVos);

                componentRespVo.setVersion(Objects.equals(i.getDevelopStatus(), ComponentDevStatus.ONLINE.getType()) ? i.getLatestVersion() : "暂未上线");
                componentRespVo.setCreator(first.isPresent() ? first.get().getUsername() : "-");
                componentListRespVoList.add(componentRespVo);
            });
        }

        pageBaseListRespVo.setTotal(componentPage.getTotal());
        pageBaseListRespVo.setPageSize(componentListReqVo.getPageSize());
        pageBaseListRespVo.setCurPage(componentListReqVo.getCurPage());
        pageBaseListRespVo.setList(componentListRespVoList);
        return pageBaseListRespVo;
    }

    @Override
    public IdRespVo toLib(String id, ToLibReqVo reqInfo) {
        Component componentInfo = ResourceUtil.checkResource(baseMapper, id);
        if (Objects.equals(componentInfo.getAccountId(), Constant.INNER_ACCOUNT_ID)) {
            throw new BaseException(ResultCode.NO_AUTH.getCode(), ResultCode.NO_AUTH.getMsg());
        }

        Component component = new Component();
        component.setId(id);
        component.setIsLib(reqInfo.getToLib() ? 1 : 0);
        baseMapper.updateById(component);

        return new IdRespVo(id);
    }

    @Override
    public ComponentInfoRespVo getComponentInfo(String id) {
        Component componentInfo = ResourceUtil.checkResource(baseMapper, id);
        Map<String, List<Project>> componentIdProjectMap = getProjectsByComponentIds(Collections.singletonList(id));
        Map<String, List<Tag>> componentIdTagMap = getTradesByComponentIds(Collections.singletonList(id));
        Map<String, List<ComponentVersion>> componentIdVersionMap = getVersionsByComponentIds(Collections.singletonList(id));

        ComponentInfoRespVo componentRespVo = ComponentInfoRespVo.dtoToBean(componentInfo);
        componentRespVo.setProjects(componentIdProjectMap.get(componentInfo.getId()) != null ? structUtil.convertProjectsRespVo(componentIdProjectMap.get(componentInfo.getId())) : new ArrayList<>());
        componentRespVo.setTags(componentIdTagMap.get(componentInfo.getId()) != null ? structUtil.convertTagsRespVo(componentIdTagMap.get(componentInfo.getId())) : new ArrayList<>());
        componentRespVo.setVersions(componentIdVersionMap.get(componentInfo.getId()) != null ? structUtil.convertComponentVersionsRespVo(componentIdVersionMap.get(componentInfo.getId())) : new ArrayList<>());

//        List<JSONObject> usersInfo = doucApiImp.getUserInfoByIds(Collections.singletonList(componentInfo.getCreator()));
//        Optional<JSONObject> curUserInfo = usersInfo.stream().filter(i -> Objects.equals(Long.parseLong(i.getStr("userId")), componentInfo.getCreator())).findFirst();

        UserInfoVo creatorUserInfoVo = new UserInfoVo();
        creatorUserInfoVo.setId(componentInfo.getCreator());
        log.info("componentInfo.getCreator():{}",componentInfo.getCreator());
        String creator = StrUtil.str(componentInfo.getCreator(), (Charset) null);
        List<BaseUser> usersInfo = baseUserService.list(Wrappers.<BaseUser>lambdaQuery().in(CollUtil.isNotEmpty(ListUtil.of(creator)),BaseUser::getId, ListUtil.of(creator)));
        Optional<BaseUser> curCreatorUserInfo = usersInfo.stream().filter(i -> Objects.equals(i.getId(), creator)).findFirst();
        creatorUserInfoVo.setUsername(curCreatorUserInfo.isPresent() ? curCreatorUserInfo.get().getUsername() : "-");
        componentRespVo.setCreatorInfo(creatorUserInfoVo);
        log.info("componentRespVo.setCreatorInfo:{}",componentRespVo.getCreatorInfo());
        return componentRespVo;
    }

    @Override
    public IdRespVo updateInfo(String id, ComponentReqVo componentReqVo) {
        Long accountId = ThreadLocalContext.getAccountId();
        Component componentInfo = ResourceUtil.checkResource(baseMapper, id);
        if (Objects.equals(componentInfo.getAccountId(), Constant.INNER_ACCOUNT_ID)) {
            throw new BaseException(ResultCode.NO_AUTH.getCode(), ResultCode.NO_AUTH.getMsg());
        }

        String type = componentReqVo.getType();
        if (StringUtils.isEmpty(type)){
            type = componentInfo.getType();
        }
        if (Objects.equals(type, ComponentType.PROJECT.getType())) {
            List<String> projects = componentReqVo.getProjects();
            if (null != projects && projects.size() == 0) {
                // 项目组件不能没有所属项目
                log.warn("项目组件至少有一个所属项目");
                throw new BaseException(ResultCode.UPDATE_BASIC_INFO_FAIL.getCode(), "项目组件至少有一个所属项目");
            }else if (CollectionUtil.isNotEmpty(projects)){
                iComponentProjectRefService.deleteComponentProjectRefByComponentId(id);
                iComponentProjectRefService.save(id, projects);
            }
        } else if (Objects.equals(type, ComponentType.COMMON.getType())) {
            // 基础组件删除项目关联
            iComponentProjectRefService.deleteComponentProjectRefByComponentId(id);
        }

        LambdaQueryWrapper<Component> componentLambdaQueryWrapper = new LambdaQueryWrapper<>();
        componentLambdaQueryWrapper.in(Component::getAccountId, Arrays.asList(accountId, Constant.INNER_ACCOUNT_ID))
                .ne(Component::getId, id)
                .eq(Component::getName, componentReqVo.getName());

        Component existsComponent = baseMapper.selectOne(componentLambdaQueryWrapper);
        if (existsComponent != null) {
            throw new BaseException(ResultCode.EXISTS_ALREADY_COMPONENT.getCode(), ResultCode.EXISTS_ALREADY_COMPONENT.getMsg());
        }
        Component component = ComponentReqVo.dtoToBean(componentReqVo);
        component.setId(id);


        //组件封面图
        if (StringUtils.isNotEmpty(componentReqVo.getComponentCover())) {
            String srcPath = portalWebPath + componentReqVo.getComponentCover();
            if (!new File(srcPath).exists()) {
                throw new BaseException(ResultCode.COMPONENT_CUSTOM_COVER_PATH_ERROR.getCode(), ResultCode.COMPONENT_CUSTOM_COVER_PATH_ERROR.getMsg());
            }
            String targetPath = componentBasePath + File.separator + id + "/v-current/components/cover.jpeg";
            FileUtil.move(new File(srcPath), new File(targetPath), true);
            component.setCover(componentRelativePath + File.separator + id + "/v-current/components/cover.jpeg");
        }else {
            component.setCover("");
        }

        if (CollectionUtil.isNotEmpty(componentReqVo.getTags())) {
            iTagRefService.updateTagsRef(id, componentReqVo.getTags(), ResourceType.COMPONENT.getType());
        }else{
            iTagRefService.deleteTagsRef(id,ResourceType.COMPONENT.getType());
        }
        baseMapper.updateById(component);
        return new IdRespVo(id);
    }

    @Override
    public Long getComponentCount(ComponentListReqVo reqInfo) {
        Long accountId = ThreadLocalContext.getAccountId();
        LambdaQueryWrapper<Component> lambdaQueryWrapper = new LambdaQueryWrapper<>();
        lambdaQueryWrapper.in(Component::getAccountId, Arrays.asList(accountId, Constant.INNER_ACCOUNT_ID));

        if (reqInfo.getIsLib() != null) {
            lambdaQueryWrapper.eq(Component::getIsLib, reqInfo.getIsLib());
        }
        return baseMapper.selectCount(lambdaQueryWrapper);
    }


    private void replaceComponentVersion(String srcVersion, String tarVersion, String releasePath, String targetSrcPath) {
        FileUtils.autoReplace(releasePath + "/main.js", srcVersion, tarVersion);
        FileUtils.autoReplace(releasePath + "/main.js.map", srcVersion, tarVersion);
        FileUtils.autoReplace(releasePath + "/setting.js", srcVersion, tarVersion);
        FileUtils.autoReplace(releasePath + "/setting.js.map", srcVersion, tarVersion);

        FileUtils.autoReplace(targetSrcPath + "/main.js", srcVersion, tarVersion);
        FileUtils.autoReplace(targetSrcPath + "/setting.js", srcVersion, tarVersion);
    }

    private void gitInit(String componentId) {
        try {
            String gitPath = componentBasePath + File.separator + componentId + File.separator + componentInitVersion;
            Git git = Git.init().setDirectory(new File(gitPath)).call();

            AddCommand add = git.add();
            add.addFilepattern(".").call();

            CommitCommand commit = git.commit();
            commit.setCommitter(gitUsername, gitEmail);
            commit.setMessage("Update commit at " + DateUtil.format(new Date(), "yyyy-MM-dd HH:mm:ss"));

            commit.call();

        } catch (GitAPIException e) {
            log.error("{}: folder git init error: {}", componentId, e);
        }
    }

    private void gitPush(String componentId, String gitPath) {
        try {
            Git git = Git.init().setDirectory(new File(gitPath)).call();
            Status statusCall = git.status().call();
            boolean clean = statusCall.isClean();
            if (!clean) {
                AddCommand add = git.add();
                add.addFilepattern(".").call();

                CommitCommand commit = git.commit();
                commit.setMessage("Update commit at " + DateUtil.format(new Date(), "yyyy-MM-dd HH:mm:ss"));
                commit.call();
            }
        } catch (GitAPIException e) {
            log.error("{}: folder git push error:{}", componentId, e);
        }
    }

    @Override
    public String getComponentCommitInfo(String componentId, String hash) {
        String componentPath = componentBasePath + File.separator + componentId;
        String gitPath = componentPath + File.separator + componentInitVersion;

        StringBuilder compressHtml = new StringBuilder();
        try {
            Git git = Git.open(new File(gitPath));

            Repository repository = git.getRepository();
            ObjectReader reader = repository.newObjectReader();
            CanonicalTreeParser oldTreeIter = new CanonicalTreeParser();

            ObjectId head = repository.resolve(hash + "^{tree}");
            ObjectId old = repository.resolve(hash + "~1^{tree}");
            CanonicalTreeParser newTreeIter = new CanonicalTreeParser();
            newTreeIter.reset(reader, head);

            if (old != null) {
                oldTreeIter.reset(reader, old);
            }
            List<DiffEntry> diffs = git.diff().setNewTree(newTreeIter).setOldTree(oldTreeIter).call();

            ByteArrayOutputStream out = new ByteArrayOutputStream();
            DiffFormatter df = new DiffFormatter(out);
            df.setRepository(git.getRepository());

            for (DiffEntry diffEntry : diffs) {
                df.format(diffEntry);
                String diffText = out.toString("UTF-8");
                // 大于堆内存限制，截取字符串
                if (compressHtml.length() > 1 * 1024 * 1024) {
                    break;
                }
                compressHtml.append(diffText);
            }
        } catch (IOException | GitAPIException e) {
            log.error("{}: get git diff error:{}", componentId, e.getMessage(), e);
            throw new BaseException(ResultCode.GET_COMPONENT_DIFF_INFO_ERROR.getCode(), ResultCode.GET_COMPONENT_DIFF_INFO_ERROR.getMsg());
        }

        return compressHtml.toString();
    }

    private Map<String, List<Project>> getProjectsByComponentIds(List<String> componentIds) {
        Map<String, List<Project>> componentIdProjectsMap = new HashMap<>();
        //
        Map<String, List<Project>> projectMap = new HashMap<>();

        if (!componentIds.isEmpty()) {
            List<ComponentProjectRef> componentProjectRefs = iComponentProjectRefService.getComponentProjectRefByComponentIds(componentIds);
            List<String> projectIds = componentProjectRefs.stream().map(ComponentProjectRef::getProjectId).collect(Collectors.toList());

            if (!projectIds.isEmpty()) {
                LambdaQueryWrapper<Project> projectLambdaQueryWrapper = new LambdaQueryWrapper<>();
                projectLambdaQueryWrapper.in(Project::getId, projectIds);
                List<Project> projectList = iProjectService.getBaseMapper().selectList(projectLambdaQueryWrapper);
                projectList.forEach(i -> {
                    if (projectMap.get(i.getId()) == null) {
                        List<Project> projects = new ArrayList<>();
                        projects.add(i);
                        projectMap.put(i.getId(), projects);
                    } else {
                        projectMap.get(i.getId()).add(i);
                    }
                });
            }
            //componentId 和project 建立映射关系
            componentProjectRefs.forEach(i -> {
                if (projectMap.get(i.getProjectId()) != null) {
                    if (componentIdProjectsMap.get(i.getComponentId()) == null) {
                        List<Project> projects = new ArrayList<>(projectMap.get(i.getProjectId()));
                        componentIdProjectsMap.put(i.getComponentId(), projects);
                    } else {
                        componentIdProjectsMap.get(i.getComponentId()).addAll(projectMap.get(i.getProjectId()));
                    }
                }
            });
        }
        return componentIdProjectsMap;
    }

    private Map<String, List<Tag>> getTradesByComponentIds(List<String> componentIds) {
        Map<String, List<Tag>> componentIdTagsMap = new HashMap<>();
        Map<String, List<Tag>> tagMap = new HashMap<>();

        if (!componentIds.isEmpty()) {
            List<ComponentTagRef> componentTagRefs = iComponentTagRefService.getComponentTagRefsByComponentIds(componentIds);
            List<String> tagIds = componentTagRefs.stream().map(ComponentTagRef::getTagId).collect(Collectors.toList());
            if (!tagIds.isEmpty()) {
                LambdaQueryWrapper<Tag> tagLambdaQueryWrapper = new LambdaQueryWrapper<>();
                tagLambdaQueryWrapper.in(Tag::getId, tagIds);
                List<Tag> tagList = iTagService.getBaseMapper().selectList(tagLambdaQueryWrapper);
                tagList.forEach(i -> {
                    if (tagMap.get(i.getId()) == null) {
                        List<Tag> tags = new ArrayList<>();
                        tags.add(i);
                        tagMap.put(i.getId(), tags);
                    } else {
                        tagMap.get(i.getId()).add(i);
                    }
                });
            }
            //componentId tag 建立映射关系
            componentTagRefs.forEach(i -> {
                if (tagMap.get(i.getTagId()) != null) {
                    if (componentIdTagsMap.get(i.getComponentId()) == null) {
                        List<Tag> tags = new ArrayList<>(tagMap.get(i.getTagId()));
                        componentIdTagsMap.put(i.getComponentId(), tags);
                    } else {
                        componentIdTagsMap.get(i.getComponentId()).addAll(tagMap.get(i.getTagId()));
                    }
                }
            });
        }

        return componentIdTagsMap;
    }

    private Map<String, List<ComponentVersion>> getVersionsByComponentIds(List<String> componentIds) {
        Map<String, List<ComponentVersion>> componentIdVersionsMap = new HashMap<>();
        Map<String, List<ComponentVersion>> versionsMap = new HashMap<>();

        if (!componentIds.isEmpty()) {
            List<ComponentVersion> componentVersionsByIds = iComponentVersionService.getComponentVersionByComponentIds(componentIds);
            List<String> versionIds = componentVersionsByIds.stream().map(ComponentVersion::getId).collect(Collectors.toList());
            if (!versionIds.isEmpty()) {
                LambdaQueryWrapper<ComponentVersion> queryWrapper = new LambdaQueryWrapper<>();
                queryWrapper.in(ComponentVersion::getId, versionIds);
                List<ComponentVersion> versionList = iComponentVersionService.getBaseMapper().selectList(queryWrapper);
                versionList.forEach(i -> {
                    if (versionsMap.get(i.getId()) == null) {
                        List<ComponentVersion> componentVersions = new ArrayList<>();
                        componentVersions.add(i);
                        versionsMap.put(i.getId(), componentVersions);
                    } else {
                        versionsMap.get(i.getId()).add(i);
                    }
                });
            }
            //componentId tag 建立映射关系
            componentVersionsByIds.forEach(i -> {
                if (versionsMap.get(i.getId()) != null) {
                    if (componentIdVersionsMap.get(i.getComponentId()) == null) {
                        List<ComponentVersion> versions = new ArrayList<>(
                                versionsMap.get(i.getId()));
                        componentIdVersionsMap.put(i.getComponentId(), versions);
                    } else {
                        componentIdVersionsMap.get(i.getComponentId()).addAll(versionsMap.get(i.getId()));
                    }
                }
            });
        }
        return componentIdVersionsMap;
    }


    @Override
    public void releaseComponent(String id, CommonReleaseReqVo commonReleaseReqVo) {
        Component component = ResourceUtil.checkResource(baseMapper, id);
        if (Objects.equals(component.getAccountId(), Constant.INNER_ACCOUNT_ID)) {
            throw new BaseException(ResultCode.NO_AUTH.getCode(), ResultCode.NO_AUTH.getMsg());
        }

        boolean compatible = commonReleaseReqVo.getCompatible();
        if (!compatible && StringUtils.isEmpty(commonReleaseReqVo.getNo())) {
            throw new BaseException(ResultCode.COMPONENT_VERSION_UNAVAIABLE.getCode(), ResultCode.COMPONENT_VERSION_UNAVAIABLE.getMsg());
        }

        String latestVersion = component.getLatestVersion();
        if (!compatible && latestVersion.equals(commonReleaseReqVo.getNo())) {
            throw new BaseException(ResultCode.EXISTS_ALREADY_COMPONENT_VERSEION.getCode(), ResultCode.EXISTS_ALREADY_COMPONENT_VERSEION.getMsg());
        }

        //true 兼容 数据库的version
        String newNo = compatible ? (commonReleaseReqVo.getNo() != null ? commonReleaseReqVo.getNo() : latestVersion) : commonReleaseReqVo.getNo();
        initReleaseWorkspace(id, newNo);
        ComponentVersion componentVersionNew = new ComponentVersion();
        componentVersionNew.setComponentId(id);
        componentVersionNew.setNo(newNo);
        componentVersionNew.setDesc(commonReleaseReqVo.getDesc());
        iComponentVersionService.save(componentVersionNew);

        component.setLatestVersion(newNo);
        component.setDevelopStatus(ComponentDevStatus.ONLINE.getType());
        baseMapper.updateById(component);
    }

    @Override
    public IdRespVo importComponent(String id, MultipartFile file) {
        Component componentInfo = ResourceUtil.checkResource(baseMapper, id);
        if (Objects.equals(componentInfo.getAccountId(), Constant.INNER_ACCOUNT_ID)) {
            throw new BaseException(ResultCode.NO_AUTH.getCode(), ResultCode.NO_AUTH.getMsg());
        }

        String componentPath = componentBasePath + File.separator + id;
        String componentDevPath = componentPath + File.separator + componentInitVersion;

        String componentTmpPath = tmpPath;
        String zipFilePath = componentTmpPath + File.separator + file.getOriginalFilename();
        String unZipFilePath = zipFilePath.substring(0, zipFilePath.length() - 4);

        if (StringUtils.isBlank(zipFilePath) || !zipFilePath.endsWith(".zip")) {
            throw new BaseException(ResultCode.DIR_NOT_FOUND.getCode(), ResultCode.DIR_NOT_FOUND.getMsg());
        }

        // 文件上传到tmpPath
        File destFolder = new File(componentTmpPath);
        try {
            if (!destFolder.exists()) {destFolder.mkdirs();}
            file.transferTo(new File(zipFilePath));
            ZipUtil.unzip(zipFilePath, componentTmpPath);
        } catch (IOException e) {
            throw new BaseException(ResultCode.IMPORT_FAIL_OF_UPLOAD.getCode(), ResultCode.IMPORT_FAIL_OF_UPLOAD.getMsg());
        }

        String oldComponentId = "";
        try {
            String exportConfigStr = FileUtils.readJson(unZipFilePath + File.separator + componentInitVersion + File.separator + "export_config.json");
            JSONObject exportConfigJson = JsonUtils.parse(exportConfigStr, JSONObject.class);
            if (exportConfigJson != null) {
                oldComponentId = exportConfigJson.getStr("id");
            }
            if (StringUtils.isEmpty(oldComponentId)) {
                throw new Exception("can not find oldComponentId");
            }
        } catch (Exception e) {
            throw new BaseException(ResultCode.IMPORT_FAIL_OF_PARSE.getCode(), ResultCode.IMPORT_FAIL_OF_PARSE.getMsg());
        }

        try {
            FileUtil.del(componentDevPath);

            // 替换文件中组件id
            String replaceIdCommand = "";
            replaceIdCommand += String.format("sed -i -e 's#%s#%s#g' %s/src/main.js", oldComponentId, id, unZipFilePath + File.separator + componentInitVersion);
            replaceIdCommand += String.format("&& sed -i 's#%s#%s#g' %s/src/setting.js", oldComponentId, id, unZipFilePath + File.separator + componentInitVersion);
            replaceIdCommand += String.format("&& sed -i 's#%s#%s#g' %s/options.json", oldComponentId, id, unZipFilePath + File.separator + componentInitVersion);
            CommandUtils.exec(replaceIdCommand);
            String buildPath = unZipFilePath + File.separator + componentInitVersion + File.separator + "components";
            if (new File(buildPath).exists()) {
                String replaceBuildIdCommand = "";
                replaceBuildIdCommand += String.format("sed -i 's#%s#%s#g' %s/main.js", oldComponentId, id, buildPath);
                replaceBuildIdCommand += String.format("&& sed -i 's#%s#%s#g' %s/main.js.map", oldComponentId, id, buildPath);
                replaceBuildIdCommand += String.format("&& sed -i 's#%s#%s#g' %s/setting.js", oldComponentId, id, buildPath);
                replaceBuildIdCommand += String.format("&& sed -i 's#%s#%s#g' %s/setting.js.map", oldComponentId, id, buildPath);
                CommandUtils.exec(replaceBuildIdCommand);
            }

            // 替换文件中组件
            String replacePathCommand = "";
            replacePathCommand += String.format("sed -i 's#src=\".*/components/%s/#src=\"%s/components/%s/#g' %s/editor.html", oldComponentId, wwwRelativePath, id, unZipFilePath + File.separator + componentInitVersion);
            replacePathCommand += String.format("&& sed -i 's#src=\".*/common/#src=\"%s/common/#g' %s/editor.html", wwwRelativePath, unZipFilePath + File.separator + componentInitVersion);
            replacePathCommand += String.format("&& sed -i 's#href=\".*/common/#href=\"%s/common/#g' %s/editor.html", wwwRelativePath, unZipFilePath + File.separator + componentInitVersion);
            replacePathCommand += String.format("&& sed -i 's#src=\".*/components/%s/#src=\"%s/components/%s/#g' %s/index.html", oldComponentId, wwwRelativePath, id, unZipFilePath + File.separator + componentInitVersion);
            replacePathCommand += String.format("&& sed -i 's#src=\".*/common/#src=\"%s/common/#g' %s/index.html", wwwRelativePath, unZipFilePath + File.separator + componentInitVersion);
            replacePathCommand += String.format("&& sed -i \"s#componentsDir.*components'#componentsDir: '%s/components'#g\" %s/env.js", wwwRelativePath, unZipFilePath + File.separator + componentInitVersion);
            CommandUtils.exec(replacePathCommand);
            FileUtils.copyFolderWithDepth(unZipFilePath, null, componentPath, null);
        } catch (Exception e) {
            throw new BaseException(ResultCode.IMPORT_FAIL.getCode(), ResultCode.IMPORT_FAIL.getMsg());
        } finally {
            boolean delete = FileUtil.del(componentTmpPath);
            if (!delete) {
                log.error("{}: tmp folder delete fail", id);
            }
        }

        return new IdRespVo(id);
    }

    @Override
    public void exportComponent(HttpServletRequest requests, HttpServletResponse response, String id) {
        Component componentInfo = ResourceUtil.checkResource(baseMapper, id);
        String componentPath = componentBasePath + File.separator + id;
        String componentDevPath = componentPath + File.separator + componentInitVersion;

        String componentTmpPath = tmpPath + File.separator + componentInfo.getName();
        String componentTmpSourcePath = componentTmpPath + File.separator + componentInitVersion;
        String zipDestName = tmpPath + File.separator + componentInfo.getName() + ".zip";

        if (!new File(componentPath).exists()) {
            throw new BaseException(ResultCode.DIR_NOT_FOUND.getCode(), ResultCode.DIR_NOT_FOUND.getMsg());
        }

        try {
            log.info("copy component:{} 到:{}", componentDevPath, componentTmpPath);
            List<String> excludePath = Arrays.asList("node_modules", ".git");
            FileUtils.copyFolder(componentDevPath, excludePath, componentTmpPath);

            // 替换导出文件内容
            String sedCommand = "";
            sedCommand += String.format("sed -i 's#src=\".*/components/#src=\"/components/#g' %s/editor.html", componentTmpSourcePath);
            sedCommand += String.format("&& sed -i 's#src=\".*/common/#src=\"/common/#g' %s/editor.html", componentTmpSourcePath);
            sedCommand += String.format("&& sed -i 's#href=\".*/common/#href=\"/common/#g' %s/editor.html", componentTmpSourcePath);
            sedCommand += String.format("&& sed -i 's#src=\".*/components/#src=\"/components/#g' %s/index.html", componentTmpSourcePath);
            sedCommand += String.format("&& sed -i 's#src=\".*/common/#src=\"/common/#g' %s/index.html", componentTmpSourcePath);
            sedCommand += String.format("&& sed -i \"s#componentsDir.*components'#componentsDir: 'components'#g\" %s/env.js", componentTmpSourcePath);
            CommandUtils.exec(sedCommand);

            JSONObject exportConfig = new JSONObject();
            exportConfig.set("id", id);
            FileUtils.writeJson(componentTmpSourcePath, "export_config.json", exportConfig);

            File zip = ZipUtil.zip(componentTmpPath, zipDestName, true);
            response.reset();
            response.setContentType("application/octet-stream;charset=utf-8");
            response.setCharacterEncoding("UTF-8");
            response.setHeader("Content-disposition", "attachment;filename=" + URLEncoder.encode(componentInfo.getName() + ".zip", "UTF-8"));
            response.setContentLength((int) zip.length());

            log.info("Start export component, and file name is {}, and size is {}", zipDestName, zip.length());
            long st = System.currentTimeMillis();
            InputStream inStream = null;
            try {
                inStream = Files.newInputStream(zip.toPath());
                byte[] b = new byte[1024];
                int len;
                while ((len = inStream.read(b)) > 0) {
                    response.getOutputStream().write(b, 0, len);
                }

            } catch (IOException e) {
                e.printStackTrace();
            }finally {
                if (inStream != null) {
                    inStream.close();
                }
            }
            log.info("Success export component. and cost time is {}.", (System.currentTimeMillis() - st));
        } catch (Exception e) {
            log.error("{}: export fail:: " + e.getMessage(), id, e);
            throw new BaseException(ResultCode.EXPORT_FAIL.getCode(), ResultCode.EXPORT_FAIL.getMsg());
        } finally {
            boolean delete = FileUtil.del(componentTmpPath);
            if (!delete) {
                log.error("{}: tmp folder delete fail", id);
            }
        }
    }

    private void initReleaseWorkspace(String componentId, String newNo) {
        String originPath = componentBasePath + File.separator + componentId + File.separator + componentInitVersion + File.separator + "components";
        String targetReleasePath = componentBasePath + File.separator + componentId + File.separator + newNo + File.separator + "release";
        String targetSrcPath = componentBasePath + File.separator + componentId + File.separator + newNo + File.separator + "src";
        File f = new File(originPath + "/main.js");
        if (!f.exists()) {
            throw new BaseException(ResultCode.COMPONENT_BUILD.getCode(), ResultCode.COMPONENT_BUILD.getMsg());
        }
        // 复制组件目录
        log.info("copy component:{} to:{}", originPath, targetReleasePath);
        FileUtils.copyFolderWithDepth(originPath, null, targetReleasePath, 0);//excludePath is null

        File srcFile = new File(targetSrcPath);
        if (srcFile.exists()) {
            FileUtil.del(targetSrcPath);
        }
        // 复制源码
        FileUtils.copyFolderWithDepth(componentBasePath + File.separator + componentId + "/v-current/src", null, targetSrcPath, 0);
        // 替换组件id
        replaceComponentVersion(componentInitVersion, newNo, targetReleasePath, targetSrcPath);
    }


    @Override
    public List<ComponentCategoryRespVo> getListWithCategory(String id, String name, String type, Integer allowDataSearch) {
        Long accountId = ThreadLocalContext.getAccountId();

        List<ComponentCategoryRespVo> categoryList = iComponentCategoryService.getCategoryList(null);

        LambdaQueryWrapper<Component> componentWrapper = new LambdaQueryWrapper<>();
        List<String> idList = new ArrayList<>();
        String projectId = null;
        if (null != id) {
            Application application = iApplicationService.getBaseMapper().selectById(id);
            projectId = application.getProjectId();
            if (null == projectId) {
                throw new BaseException(ResultCode.APPLICATION_NO_PROJECT.getCode(), ResultCode.APPLICATION_NO_PROJECT.getMsg());
            }
            //根据项目ID，查找所属项目下的组件IDs
            LambdaQueryWrapper<ComponentProjectRef> componentProjectRefLambdaQueryWrapper = new LambdaQueryWrapper<>();
            componentProjectRefLambdaQueryWrapper.eq(StringUtils.isNotBlank(projectId), ComponentProjectRef::getProjectId, projectId);
            List<ComponentProjectRef> componentProjectRefs = componentProjectRefService.list(componentProjectRefLambdaQueryWrapper);
            for (ComponentProjectRef componentProjectRef : componentProjectRefs) {
                idList.add(componentProjectRef.getComponentId());
            }

        }


        componentWrapper.eq(StringUtils.isNotEmpty(name), Component::getName, name)
                .eq(StringUtils.isNotEmpty(type), Component::getType, type)
                .in(type.equals("project") && !CollectionUtil.isEmpty(idList), Component::getId, idList)
                .eq(allowDataSearch != null, Component::getAllowDataSearch, allowDataSearch)
                .eq(Component::getDevelopStatus, ComponentDevStatus.ONLINE.getType())
                .in(Component::getAccountId, Arrays.asList(accountId, Constant.INNER_ACCOUNT_ID));

        List<Component> components = baseMapper.selectList(componentWrapper);
        HashMap<String, List<ComponentRespVo>> componentMap = new HashMap<>();
        components.forEach(c -> {
            String key = c.getSubCategoryId();
            List<ComponentRespVo> componentList = componentMap.get(key);
            ComponentRespVo componentRespVo = structUtil.convertComponentRespVo(c);
            componentRespVo.setVersion(c.getLatestVersion());

            if (null == componentList) {
                ArrayList<ComponentRespVo> cateComponents = new ArrayList<>();
                cateComponents.add(componentRespVo);
                componentMap.put(key, cateComponents);
            } else {
                componentList.add(componentRespVo);
            }
        });

        ArrayList<ComponentCategoryRespVo> resCategoryList = new ArrayList<>();
        categoryList.forEach(parent -> {
            ComponentCategoryRespVo parentCategory = new ComponentCategoryRespVo();
            parentCategory.setId(parent.getId());
            parentCategory.setName(parent.getName());
            parentCategory.setIcon(parent.getIcon());

            if (parent.getSubCategories() != null) {
                parent.getSubCategories().forEach(sub -> {
                    List<ComponentRespVo> cateComponents = componentMap.getOrDefault(sub.getId(), new ArrayList<>());
                    if (cateComponents.size() > 0) {
                        ComponentCategorySubRespVo subCategory = new ComponentCategorySubRespVo();
                        subCategory.setId(sub.getId());
                        subCategory.setName(sub.getName());
                        subCategory.setComponents(cateComponents);
                        List<ComponentCategorySubRespVo> subCategories = parentCategory.getSubCategories();
                        if (subCategories == null) {
                            subCategories = new ArrayList<>();
                            subCategories.add(subCategory);
                            parentCategory.setSubCategories(subCategories);
                        } else {
                            subCategories.add(subCategory);
                        }
                    }
                });
            }

            if (parentCategory.getSubCategories() != null) {
                resCategoryList.add(parentCategory);
            }
        });
        return resCategoryList;
    }

    //select * from component where deleted =0  and
    //(account_id IN (110, -1) and develop_status = 'online'  and( name like '%水%' or id = '水' )  and
    //(type = 'common' or(type = 'project' and  id in ('123', '604382273386565632'))))
    @Override
    public PageBaseListRespVo getListByIdName(SearchComponentListReqVo searchComponentListReqVo) {
        PageBaseListRespVo pageBaseListRespVo = new PageBaseListRespVo();
        pageBaseListRespVo.setTotal(0L);
        pageBaseListRespVo.setPageSize(searchComponentListReqVo.getPageSize());
        pageBaseListRespVo.setCurPage(searchComponentListReqVo.getCurPage());
        pageBaseListRespVo.setList(new ArrayList<>());

        //搜索应用所属项目ID
        String id = searchComponentListReqVo.getId();
        String projectId = null;
        List<String> idList = new ArrayList<>();
        LambdaQueryWrapper<Component> componentLambdaQueryWrapper = new LambdaQueryWrapper<>();
        if (StringUtils.isNotBlank(id)) {
            Application application = iApplicationService.getBaseMapper().selectById(id);
            projectId = application.getProjectId();
            if (null == projectId) {
                throw new BaseException(ResultCode.APPLICATION_NO_PROJECT.getCode(), ResultCode.APPLICATION_NO_PROJECT.getMsg());
            }
            //根据项目ID，查找所属项目下的组件IDs
            LambdaQueryWrapper<ComponentProjectRef> componentProjectRefLambdaQueryWrapper = new LambdaQueryWrapper<>();
            componentProjectRefLambdaQueryWrapper.eq(StringUtils.isNotBlank(projectId), ComponentProjectRef::getProjectId, projectId);
            List<ComponentProjectRef> componentProjectRefs = componentProjectRefService.list(componentProjectRefLambdaQueryWrapper);
            for (ComponentProjectRef componentProjectRef : componentProjectRefs) {
                idList.add(componentProjectRef.getComponentId());
            }
        }

        Long accountId = ThreadLocalContext.getAccountId();

        //查找组件条件
        componentLambdaQueryWrapper.in(Component::getAccountId, Arrays.asList(accountId, Constant.INNER_ACCOUNT_ID))
                .eq(Component::getDevelopStatus, ComponentDevStatus.ONLINE.getType())
                .and(StringUtils.isNotEmpty(searchComponentListReqVo.getTerm()), tmp -> tmp.like(StringUtils.isNotEmpty(searchComponentListReqVo.getTerm()), Component::getName, searchComponentListReqVo.getTerm()).or()
                        .eq(StringUtils.isNotEmpty(searchComponentListReqVo.getTerm()), Component::getId, searchComponentListReqVo.getTerm()))
                .and(p -> p.eq(Component::getType, "common")
                        .or(t -> t.eq(Component::getType, "project")
                                .in(idList.size() > 0, Component::getId, idList)));

        Page<Component> page = new Page<>(searchComponentListReqVo.getCurPage(), searchComponentListReqVo.getPageSize());

        componentLambdaQueryWrapper.orderByDesc(Component::getUpdateTime);
        Page<Component> componentPage = baseMapper.selectPage(page, componentLambdaQueryWrapper);
        List<Component> componentList = componentPage.getRecords();
        List<ComponentRespVo> componentListRespVoList = new ArrayList<>();

        if (componentList != null && !componentList.isEmpty()) {
//            List<Long> userIds = componentList.stream().map(Component::getCreator).filter(Objects::nonNull).distinct().collect(Collectors.toList());
//            List<JSONObject> usersInfo = doucApiImp.getUserInfoByIds(userIds);
            String userId = String.valueOf(ThreadLocalContext.getUserId());
            List<BaseUser> list = baseUserService.list();
            Map<String, BaseUser> collect = list.stream().collect(Collectors.toMap(x -> x.getId(), x -> x));
            List<String> componentIds = componentList.stream().map(Component::getId).collect(Collectors.toList());
            Map<String, List<Project>> componentIdProjectMap = getProjectsByComponentIds(componentIds);
            Map<String, List<Tag>> componentIdTagMap = getTradesByComponentIds(componentIds);

            componentList.forEach(i -> {
                ComponentRespVo componentRespVo = ComponentRespVo.dtoToBean(i);
//                Optional<JSONObject> curUserInfo = usersInfo.stream().filter(user -> Objects.equals(user.getLong("userId"), i.getCreator())).findFirst();

                componentRespVo.setProjects(componentIdProjectMap.get(i.getId()) != null ? structUtil.convertProjectsRespVo(componentIdProjectMap.get(i.getId())) : new ArrayList<>());
                componentRespVo.setTags(componentIdTagMap.get(i.getId()) != null ? structUtil.convertTagsRespVo(componentIdTagMap.get(i.getId())) : new ArrayList<>());
                componentRespVo.setVersion(Objects.equals(i.getDevelopStatus(), ComponentDevStatus.ONLINE.getType()) ? i.getLatestVersion() : "暂未上线");
                componentRespVo.setCreator(collect.get(userId).getUsername());
                componentListRespVoList.add(componentRespVo);
            });
        }

        pageBaseListRespVo.setTotal(componentPage.getTotal());
        pageBaseListRespVo.setPageSize(searchComponentListReqVo.getPageSize());
        pageBaseListRespVo.setCurPage(searchComponentListReqVo.getCurPage());
        pageBaseListRespVo.setList(componentListRespVoList);
        return pageBaseListRespVo;
    }
}



