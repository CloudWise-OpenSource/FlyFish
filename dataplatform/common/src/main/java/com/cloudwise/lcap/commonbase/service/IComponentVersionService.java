package com.cloudwise.lcap.commonbase.service;

import com.cloudwise.lcap.commonbase.entity.ComponentVersion;
import com.baomidou.mybatisplus.extension.service.IService;
import java.util.List;

/**
 * <p>
 *  服务类
 * </p>
 *
 * @author ethan.du
 * @since 2022-08-01
 */
public interface IComponentVersionService extends IService<ComponentVersion> {

    ComponentVersion getComponentNewestVersion(String componentId);

    ComponentVersion getComponentVersion(String componentId,String no);

    List<ComponentVersion> getComponentVersions(String componentId);
    List<ComponentVersion> getComponentVersionByComponentIds(List<String> componentIds);
}
