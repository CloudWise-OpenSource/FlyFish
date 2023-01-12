package com.cloudwise.lcap.devserver.service;

import cn.hutool.core.date.DateUtil;
import cn.hutool.core.io.FileUtil;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.cloudwise.lcap.commonbase.contants.Constant;
import com.cloudwise.lcap.commonbase.entity.Component;
import com.cloudwise.lcap.commonbase.entity.ComponentProjectRef;
import com.cloudwise.lcap.commonbase.enums.ComponentDevStatus;
import com.cloudwise.lcap.commonbase.enums.ResourceType;
import com.cloudwise.lcap.commonbase.enums.ResultCode;
import com.cloudwise.lcap.commonbase.enums.ValidType;
import com.cloudwise.lcap.commonbase.exception.BaseException;
import com.cloudwise.lcap.commonbase.mapper.ApplicationMapper;
import com.cloudwise.lcap.commonbase.mapper.ComponentMapper;
import com.cloudwise.lcap.commonbase.mapstruct.StructUtil;
import com.cloudwise.lcap.commonbase.service.*;
import com.cloudwise.lcap.commonbase.service.impl.ComponentProjectRefServiceImpl;
import com.cloudwise.lcap.commonbase.threadlocal.ThreadLocalContext;
import com.cloudwise.lcap.commonbase.util.CommandUtils;
import com.cloudwise.lcap.commonbase.util.FileUtils;
import com.cloudwise.lcap.commonbase.util.Snowflake;
import com.cloudwise.lcap.commonbase.vo.ComponentCopyReqVo;
import com.cloudwise.lcap.commonbase.vo.ComponentReqDevVo;
import com.cloudwise.lcap.commonbase.vo.IdRespVo;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.eclipse.jgit.api.AddCommand;
import org.eclipse.jgit.api.CommitCommand;
import org.eclipse.jgit.api.Git;
import org.eclipse.jgit.api.errors.GitAPIException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.File;
import java.util.*;

import static com.cloudwise.lcap.commonbase.contants.Constant.COMPONENT_COVER_CUSTOM;

@Slf4j
@Service
public class ComponentService extends ServiceImpl<ComponentMapper, Component> {

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
    private StructUtil structUtil;

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

    public IdRespVo addComponent(ComponentReqDevVo componentReqDevVo) {
        Long accountId = ThreadLocalContext.getAccountId();
        String componentId = Snowflake.INSTANCE.nextId().toString();

        LambdaQueryWrapper<Component> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(Component::getName, componentReqDevVo.getName())
                .in(Component::getAccountId, Arrays.asList(accountId, Constant.INNER_ACCOUNT_ID));
        Component existComponent = baseMapper.selectOne(queryWrapper);
        if (existComponent != null) {
            throw new BaseException(ResultCode.ALREADY_EXISTS.getCode(), ResultCode.ALREADY_EXISTS.getMsg());
        }

        try {
            initDevWorkspace(componentId, componentReqDevVo.getName());
        } catch (Exception e) {
            throw new BaseException(ResultCode.INIT_WORKPLACE_ERROR.getCode(), ResultCode.INIT_WORKPLACE_ERROR.getMsg());
        }

        if (gitEnable) {
            gitInit(componentId);
        }

        Component component = structUtil.covertAddComponentVoToEntity(componentReqDevVo);
        component.setId(componentId);

        if (StringUtils.isNotEmpty(componentReqDevVo.getComponentCover())) {
            String srcPath = portalWebPath + componentReqDevVo.getComponentCover();
            if (!new File(srcPath).exists()) {
                throw new BaseException(ResultCode.COMPONENT_CUSTOM_COVER_PATH_ERROR.getCode(), ResultCode.COMPONENT_CUSTOM_COVER_PATH_ERROR.getMsg());
            }

            String targetPath = componentBasePath + File.separator + componentId + "/v-current/components/cover.jpeg";
            FileUtil.move(new File(srcPath), new File(targetPath), true);
            component.setCover(componentRelativePath + File.separator + componentId + "/v-current/components/cover.jpeg");
        }

        if (componentReqDevVo.getTags() != null && !componentReqDevVo.getTags().isEmpty()) {
            iTagRefService.updateTagsRef(component.getId(), componentReqDevVo.getTags(), ResourceType.COMPONENT.getType());
        }
        List<String> projectIds = componentReqDevVo.getProjects();
        if (projectIds != null && projectIds.size() > 0) {
            List<ComponentProjectRef> componentProjectRefs = new ArrayList<>();
            projectIds.forEach(i -> {
                ComponentProjectRef componentProjectRef = new ComponentProjectRef();
                componentProjectRef.setProjectId(i);
                componentProjectRef.setComponentId(component.getId());
                componentProjectRefs.add(componentProjectRef);
            });
            iComponentProjectRefService.saveBatch(componentProjectRefs);
        }
        baseMapper.insert(component);

        return new IdRespVo(componentId);
    }

    public IdRespVo copyComponent(String id, ComponentCopyReqVo newComponentInfo) {
        Long accountId = ThreadLocalContext.getAccountId();
        if ((newComponentInfo.getName()) != null) {
            LambdaQueryWrapper<Component> queryWrapper = new LambdaQueryWrapper<>();
            queryWrapper.eq(Component::getDeleted, ValidType.INVALID.getType())
                    .eq(Component::getName, newComponentInfo.getName())
                    .in(Component::getAccountId, Arrays.asList(accountId, Constant.INNER_ACCOUNT_ID));

            Component existComponent = baseMapper.selectOne(queryWrapper);
            if (existComponent != null) {
                throw new BaseException(ResultCode.ALREADY_EXISTS.getCode(), ResultCode.ALREADY_EXISTS.getMsg());
            }
        }

        Component component = new Component();
        String newComponentId = Snowflake.INSTANCE.nextId().toString();
        component.setId(newComponentId);
        component.setName(newComponentInfo.getName());
        component.setIsLib(0);
        component.setCategoryId(newComponentInfo.getCategory());
        component.setSubCategoryId(newComponentInfo.getSubCategory());
        component.setType(newComponentInfo.getType());
        component.setDesc(newComponentInfo.getDesc());
        component.setDevelopStatus(ComponentDevStatus.DOING.getType());
        component.setAutomaticCover(COMPONENT_COVER_CUSTOM);
        component.setCover(newComponentInfo.getComponentCover());

        String originPath = componentBasePath + File.separator + id + File.separator + componentInitVersion;
        String targetPath = componentBasePath + File.separator + newComponentId;
        String targetDevPath = componentBasePath + File.separator + newComponentId + File.separator + componentInitVersion;
        List<String> excludePath = Arrays.asList("node_modules", ".git", "release", "release_code", "package-lock.json");

        try {
            // 复制组件目录
            log.info("copy component:{} 到:{}", originPath, targetPath);
            FileUtils.copyFolder(originPath, excludePath, targetPath);
            // 替换组件id
            replaceComponentId(id, newComponentId, targetDevPath);
        } catch (Exception e) {
            log.error("{}: init workplace fail: " + e.getMessage(), newComponentId, e);
            throw new BaseException(ResultCode.INIT_WORKPLACE_ERROR.getCode(), ResultCode.INIT_WORKPLACE_ERROR.getMsg());
        }

        // 更新组件标签
        if (newComponentInfo.getTags() != null) {
            iTagRefService.updateTagsRef(newComponentId, newComponentInfo.getTags(), ResourceType.COMPONENT.getType());
        }
        if (newComponentInfo.getProjects() != null) {
            // 更新组件项目
            iProjectRefService.updateProjectsRef(newComponentId, newComponentInfo.getProjects(), ResourceType.COMPONENT.getType());
        }

        baseMapper.insert(component);

        // 初始化git仓库
        if (gitEnable) {
            gitInit(newComponentId);
        }
        return new IdRespVo(newComponentId);
    }

    private void replaceComponentId(String srcId, String tarId, String componentBasePath) {
        FileUtils.autoReplace(componentBasePath + "/src/main.js", srcId, tarId);
        FileUtils.autoReplace(componentBasePath + "/src/setting.js", srcId, tarId);
        FileUtils.autoReplace(componentBasePath + "/options.json", srcId, tarId);
        FileUtils.autoReplace(componentBasePath + "/editor.html", srcId, tarId);
        FileUtils.autoReplace(componentBasePath + "/index.html", srcId, tarId);

        File buildDevFolder = new File(componentBasePath + "/components");
        if (buildDevFolder.exists()) {
            FileUtils.autoReplace(componentBasePath + "/components/main.js", srcId, tarId);
            FileUtils.autoReplace(componentBasePath + "/components/main.js.map", srcId, tarId);
            FileUtils.autoReplace(componentBasePath + "/components/setting.js", srcId, tarId);
            FileUtils.autoReplace(componentBasePath + "/components/setting.js.map", srcId, tarId);
        }
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

    private void initDevWorkspace(String componentId, String componentName) {
        String componentPath = componentBasePath + File.separator + componentId;
        String componentDevPath = componentPath + File.separator + componentInitVersion;
        new File(componentDevPath).mkdirs();

        FileUtils.copyFolderWithDepth(componentTplPath, Collections.singletonList("public"), componentDevPath, 0);
        FileUtils.autoReplace(componentDevPath + "/src/main.js", "${componentId}", componentId);
        FileUtils.autoReplace(componentDevPath + "/src/main.js", "${componentVersion}", componentInitVersion);
        FileUtils.autoReplace(componentDevPath + "/src/setting.js", "${componentId}", componentId);
        FileUtils.autoReplace(componentDevPath + "/src/setting.js", "${componentVersion}", componentInitVersion);

        FileUtils.autoReplace(componentDevPath + "/editor.html", "${componentId}", componentId);
        FileUtils.autoReplace(componentDevPath + "/editor.html", "${componentVersion}", componentInitVersion);
        FileUtils.autoReplace(componentDevPath + "/editor.html", "${wwwRelativePath}", wwwRelativePath);

        FileUtils.autoReplace(componentDevPath + "/index.html", "${componentId}", componentId);
        FileUtils.autoReplace(componentDevPath + "/index.html", "${componentVersion}", componentInitVersion);
        FileUtils.autoReplace(componentDevPath + "/index.html", "${wwwRelativePath}", wwwRelativePath);

        FileUtils.autoReplace(componentDevPath + "/env.js", "${wwwRelativePath}", wwwRelativePath);

        FileUtils.autoReplace(componentDevPath + "/options.json", "${componentId}", componentId);
        FileUtils.autoReplace(componentDevPath + "/options.json", "${componentName}", componentName);

        FileUtils.autoReplace(componentDevPath + "/package.json", "${componentId}", componentId);

        String npmRunBuildCommand = String.format("cd %s && npm run build-dev", componentDevPath);
        CommandUtils.exec(npmRunBuildCommand);
    }
}
