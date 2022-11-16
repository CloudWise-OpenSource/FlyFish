package com.cloudwise.lcap.source.service;

import cn.hutool.core.collection.CollectionUtil;
import cn.hutool.core.util.ZipUtil;
import cn.hutool.json.JSONObject;
import com.cloudwise.lcap.common.BaseResponse;
import com.cloudwise.lcap.common.exception.BaseException;
import com.cloudwise.lcap.common.exception.BizException;
import com.cloudwise.lcap.common.exception.ResourceNotFoundException;
import com.cloudwise.lcap.common.utils.Assert;
import com.cloudwise.lcap.common.utils.FileUtils;
import com.cloudwise.lcap.common.utils.JsonUtils;
import com.cloudwise.lcap.source.dao.*;
import com.cloudwise.lcap.source.dto.ApplicationDto;
import com.cloudwise.lcap.source.dto.ComponentDto;
import com.cloudwise.lcap.source.model.Application;
import com.cloudwise.lcap.source.model.Component;
import com.cloudwise.lcap.source.model.ComponentCategory;
import com.cloudwise.lcap.source.model.Project;
import com.cloudwise.lcap.source.service.dto.ApplicationExportRequest;
import com.cloudwise.lcap.source.service.dto.ComponentExportRequest;
import com.cloudwise.lcap.source.service.dto.ExportResult;
import com.cloudwise.lcap.source.service.dto.Manifest;
import com.google.common.collect.Lists;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.beetl.core.util.ArraySet;
import org.bson.types.ObjectId;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

import static com.cloudwise.lcap.common.contants.Constant.*;
import static com.cloudwise.lcap.common.contants.Constant.APPLICATIONS;

@Slf4j
@Service
public class ExportResourceService {
    /**
     * 原始文件基础路径
     */
    @Value("${file.basepath}")
    private String fileBasepath;


    @Autowired
    private ComponentDao componentDao;

    public void exportComponents(Set<String> ids, String folder,Manifest manifest) {
        // 校验组件个数
        if (CollectionUtils.isNotEmpty(ids)) {
            Assert.assertFalse(ids.size() > 50, "应用和组件不得多于50个!");
            // 需校验创建模块是否存在  若不存在，则直接报错，不需要导出
            Set<String> componentsName = new HashSet<>();
            List<Component> componentsInfo = componentDao.findByIds(ids);
            Map<String, Component> collect = componentsInfo.stream().collect(Collectors.toMap(o -> o.getId().toHexString(), o -> o));
            Map<String, String> componentRecentVersion = new HashMap<>();

            List<ComponentDto> componentDtoList = new ArrayList<>();
            for (String componentId : ids) {
                Component component = collect.get(componentId);
                if (null == component) {
                    log.error("组件id:{}不存在，导出资源失败!", componentId);
                    throw new ResourceNotFoundException("组件不存在，导出资源失败!");
                }
                String recentVersion = getComponentNewestVersion(component.getVersions());
                if (StringUtils.isEmpty(recentVersion)) {
                    log.error("组件最新版本不存在,versions:{}",component.getVersions());
                    throw new BaseException("组件无版本信息，导出资源失败!");
                }
                componentRecentVersion.put(componentId, recentVersion);
                //根据导出类型判断 是否存在 /{recentVersion}/release
                String componentFilePath = fileBasepath + COMPONENTS + File.separator + componentId + File.separator + recentVersion + COMPONENT_RELEASE;
                if (!new File(componentFilePath).exists()) {
                    log.error("组件:{} 版本:{} 不存在", component.getName(), componentFilePath);
                    componentsName.add(component.getName() + File.separator + recentVersion + COMPONENT_RELEASE);
                }

                ComponentDto dto = new ComponentDto();
                dto.setId(component.getId().toHexString());
                BeanUtils.copyProperties(component, dto);
                componentDtoList.add(dto);
            }
            if (CollectionUtils.isNotEmpty(componentsName)) {
                throw new BaseException("组件" + componentsName + "资源包不存在，导出资源失败!");
            }

            log.info("");
            for (String componentId : ids) {
                String recentVersion = componentRecentVersion.get(componentId);
                // 最新版本目录 只需要release目录
                String componentFilePath = fileBasepath + COMPONENTS + File.separator + componentId + File.separator + recentVersion + COMPONENT_RELEASE;
                String filePath = folder + COMPONENTS + File.separator + componentId + File.separator + recentVersion;
                log.info("导出组件:{} 的最新版本release文件:{} 到:{}", componentId, componentFilePath, filePath);
                FileUtils.copyFolder(componentFilePath, null, filePath);
            }

            manifest.setComponentList(componentDtoList);
        }

    }

    public Set<String> getComponentIds(List<ApplicationDto> applications) {
        Set<String> ids = new ArraySet<>();
        for (ApplicationDto application : applications) {
            List<JSONObject> pages = application.getPages();
            if (CollectionUtil.isNotEmpty(pages)) {
                for (JSONObject page : pages) {
                    List<JSONObject> components = page.getBeanList("components", JSONObject.class);
                    if (CollectionUtil.isNotEmpty(components)) {
                        for (JSONObject object1 : components) {
                            String componentId = object1.getStr("type");
                            if (!"PageLink".equalsIgnoreCase(componentId)){
                                ids.add(object1.getStr("type"));
                            }
                        }
                    }
                }
            }
        }
        return ids;
    }

    private String getComponentNewestVersion(List<JSONObject> versions) {
        if (CollectionUtils.isEmpty(versions)) {
            return null;
        }
        int size = versions.size();
        JSONObject jsonObject = versions.get(size - 1);
        return (String) jsonObject.get("no");
    }
}
