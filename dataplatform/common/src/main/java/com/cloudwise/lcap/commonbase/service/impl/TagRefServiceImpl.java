package com.cloudwise.lcap.commonbase.service.impl;


import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.cloudwise.lcap.commonbase.entity.ApplicationTagRef;
import com.cloudwise.lcap.commonbase.entity.ComponentTagRef;
import com.cloudwise.lcap.commonbase.entity.Tag;
import com.cloudwise.lcap.commonbase.enums.ResourceType;
import com.cloudwise.lcap.commonbase.enums.ValidType;
import com.cloudwise.lcap.commonbase.service.ITagRefService;
import com.cloudwise.lcap.commonbase.threadlocal.ThreadLocalContext;
import com.cloudwise.lcap.commonbase.service.IApplicationTagRefService;
import com.cloudwise.lcap.commonbase.service.IComponentTagRefService;

import com.cloudwise.lcap.commonbase.service.ITagService;
import com.cloudwise.lcap.commonbase.vo.TagVo;
import org.apache.commons.collections4.CollectionUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * <p>
 * 服务实现类
 * </p>
 *
 * @author luke.miao
 * @since 2022-08-04
 */
@Service
public class TagRefServiceImpl implements ITagRefService {
    @Autowired
    ITagService iTagService;

    @Autowired
    IApplicationTagRefService iApplicationTagRefService;

    @Autowired
    IComponentTagRefService iComponentTagRefService;

    /**
     * @param refId
     * @param tags
     * @param type
     */
    @Override
    public void updateTagsRef(String refId, List<TagVo> tags, String type) {
        Long accountId = ThreadLocalContext.getAccountId();
        if (CollectionUtils.isEmpty(tags)) {
            return;
        }
        List<String> reqTagNames = tags.stream().map(TagVo::getName).collect(Collectors.toList());
        LambdaQueryWrapper<Tag> oldTagWrapper = new LambdaQueryWrapper<>();
        oldTagWrapper.eq(Tag::getAccountId, accountId)
                .eq(Tag::getType, type)
                .in(Tag::getName, reqTagNames);
        List<Tag> oldTags = iTagService.getBaseMapper().selectList(oldTagWrapper);
        List<String> oldTagNames = oldTags.stream().map(Tag::getName).collect(Collectors.toList());

        // 新增：系统不存在的tag, 需要先插入Tag
        List<String> newTagNames = reqTagNames.stream().filter(tag -> !oldTagNames.contains(tag)).collect(Collectors.toList());

        if (newTagNames.size() > 0) {
            //插入新增tag
            List<Tag> newTagData = newTagNames.stream().map(t -> {
                Tag tag = new Tag();
                tag.setAccountId(accountId);
                tag.setName(t);
                tag.setType(type);
                tag.setDeleted(ValidType.INVALID.getType());
                return tag;
            }).collect(Collectors.toList());
            iTagService.saveBatch(newTagData);
        }

        LambdaQueryWrapper<Tag> reqTagsWrapper = new LambdaQueryWrapper<>();
        reqTagsWrapper.eq(Tag::getAccountId, accountId)
                .eq(Tag::getType, type)
                .in(Tag::getName, reqTagNames);
        List<Tag> allTags = iTagService.getBaseMapper().selectList(reqTagsWrapper);

        if (ResourceType.APPLICATION.getType().equals(type)) {
            LambdaQueryWrapper<ApplicationTagRef> atrWrapper = new LambdaQueryWrapper<>();
            atrWrapper.eq(ApplicationTagRef::getApplicationId, refId);
            iApplicationTagRefService.getBaseMapper().delete(atrWrapper);

            // 更新application_tag_ref表
            List<ApplicationTagRef> updateRef = allTags.stream().map(t -> {
                ApplicationTagRef atr = new ApplicationTagRef();
                atr.setTagId(t.getId());
                atr.setApplicationId(refId);
                return atr;
            }).collect(Collectors.toList());
            iApplicationTagRefService.saveBatch(updateRef);

        } else if (ResourceType.COMPONENT.getType().equals(type)) {
/*            ComponentTagRef deleteEntity = new ComponentTagRef();
            deleteEntity.setDeleted(ValidType.VALID.getType());*/
            LambdaQueryWrapper<ComponentTagRef> atrWrapper = new LambdaQueryWrapper<>();
            atrWrapper.eq(ComponentTagRef::getComponentId, refId);
            // iComponentTagRefService.getBaseMapper().update(deleteEntity, atrWrapper);
            iComponentTagRefService.getBaseMapper().delete(atrWrapper);

            // 更新component_tag_ref表
            List<ComponentTagRef> updateRef = allTags.stream().map(t -> {
                ComponentTagRef atr = new ComponentTagRef();
                atr.setTagId(t.getId());
                atr.setComponentId(refId);
                return atr;
            }).collect(Collectors.toList());
            iComponentTagRefService.saveBatch(updateRef);
        }
    }

    @Override
    public void deleteTagsRef(String refId, String type) {
        if (ResourceType.APPLICATION.getType().equals(type)) {
            LambdaQueryWrapper<ApplicationTagRef> atrWrapper = new LambdaQueryWrapper<>();
            atrWrapper.eq(ApplicationTagRef::getApplicationId, refId);
            iApplicationTagRefService.getBaseMapper().delete(atrWrapper);
        } else if (ResourceType.COMPONENT.getType().equals(type)) {
            LambdaQueryWrapper<ComponentTagRef> atrWrapper = new LambdaQueryWrapper<>();
            atrWrapper.eq(ComponentTagRef::getComponentId, refId);
            iComponentTagRefService.getBaseMapper().delete(atrWrapper);
        }
    }
}
