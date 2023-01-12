package com.cloudwise.lcap.commonbase.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.cloudwise.lcap.commonbase.entity.Tag;
import com.cloudwise.lcap.commonbase.mapper.TagMapper;
import com.cloudwise.lcap.commonbase.mapstruct.StructUtil;
import com.cloudwise.lcap.commonbase.service.ITagService;
import com.cloudwise.lcap.commonbase.threadlocal.ThreadLocalContext;
import com.cloudwise.lcap.commonbase.vo.TagVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * <p>
 * 服务实现类
 * </p>
 *
 * @author june.yang
 * @since 2022-08-01
 */
@Service
public class TagServiceImpl extends ServiceImpl<TagMapper, Tag> implements ITagService {

    @Autowired
    StructUtil structUtil;

    @Override
    public List<TagVo> getTagList(String type){
        Long accountId = ThreadLocalContext.getAccountId();

        LambdaQueryWrapper<Tag> tagWrapper = new LambdaQueryWrapper<>();
        tagWrapper.eq(Tag::getAccountId, accountId)
                .eq(Tag::getType, type)
                .orderByDesc(Tag::getUpdateTime);
        List<Tag> tagList = baseMapper.selectList(tagWrapper);

        ArrayList<TagVo> tagVos = new ArrayList<>();
        tagList.forEach(t->{
            TagVo tagVo = structUtil.convertTagVo(t);
            tagVos.add(tagVo);
        });
        return tagVos;
    }

}
