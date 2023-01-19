package com.cloudwise.lcap.commonbase.service;

import com.cloudwise.lcap.commonbase.vo.TagVo;

import java.util.List;

/**
 * <p>
 *  服务类
 * </p>
 *
 * @author luke.miao
 * @since 2022-08-04
 */
public interface ITagRefService {
    void updateTagsRef(String id, List<TagVo> tags, String type);

    void deleteTagsRef(String id, String type);
}
