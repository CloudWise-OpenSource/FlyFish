package com.cloudwise.lcap.commonbase.service;

import com.cloudwise.lcap.commonbase.entity.Tag;
import com.baomidou.mybatisplus.extension.service.IService;
import com.cloudwise.lcap.commonbase.vo.TagVo;

import java.util.List;

/**
 * <p>
 *  服务类
 * </p>
 *
 * @author june.yang
 * @since 2022-08-01
 */
public interface ITagService extends IService<Tag> {
    List<TagVo> getTagList(String type);
}