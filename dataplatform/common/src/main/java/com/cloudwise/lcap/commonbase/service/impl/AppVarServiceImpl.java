package com.cloudwise.lcap.commonbase.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.cloudwise.lcap.commonbase.entity.AppVar;
import com.cloudwise.lcap.commonbase.enums.ResultCode;
import com.cloudwise.lcap.commonbase.enums.ValidType;
import com.cloudwise.lcap.commonbase.exception.BaseException;
import com.cloudwise.lcap.commonbase.mapper.AppVarMapper;
import com.cloudwise.lcap.commonbase.mapstruct.StructUtil;
import com.cloudwise.lcap.commonbase.service.IAppVarService;
import com.cloudwise.lcap.commonbase.vo.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * @author: june.yang
 * @create-date: 2022/11/4 3:45 PM
 */
@Service
public class AppVarServiceImpl extends ServiceImpl<AppVarMapper, AppVar> implements IAppVarService {
    @Autowired
    StructUtil structUtil;

    public List<AppVarListResVo> getList(AppVarListReqVo listInfo) {
        String appId = listInfo.getAppId();
        String varId = listInfo.getVarId();
        String name = listInfo.getName();
        String pageId = listInfo.getPageId();

        LambdaQueryWrapper<AppVar> appVarQueryWrapper = new LambdaQueryWrapper<>();
        appVarQueryWrapper.eq(AppVar::getAppId, appId);
        if (varId != null) {
            appVarQueryWrapper.eq(AppVar::getId, varId);
        }

        if (name != null) {
            appVarQueryWrapper.like(AppVar::getName, name);
        }

        if (pageId != null) {
            appVarQueryWrapper.eq(AppVar::getPageId, pageId);
        }

        List<AppVar> appVars = baseMapper.selectList(appVarQueryWrapper);

        ArrayList<AppVarListResVo> appVarListResVos = new ArrayList<>();
        appVars.forEach(var -> {
            AppVarListResVo appVarListResVo = structUtil.convertAppVarRespVo(var);
            appVarListResVos.add(appVarListResVo);
        });
        return appVarListResVos;
    }

    public void batchCreateAppVar(List<AppVarReqVo> appVars) {
        for (AppVarReqVo appVar : appVars) { createAppVar(appVar); }
    }

    public IdRespVo createAppVar(AppVarReqVo newAppVar){

        // TODO: 判断变量唯一
        LambdaQueryWrapper<AppVar> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(AppVar::getAppId, newAppVar.getAppId())
                .eq(AppVar::getPageId, newAppVar.getPageId())
                .eq(AppVar::getName, newAppVar.getName());
        Long count = baseMapper.selectCount(queryWrapper);
        if (count > 0) {
            throw new BaseException(ResultCode.ALREADY_EXISTS.getCode(), ResultCode.ALREADY_EXISTS.getMsg());
        }

        AppVar appVar = new AppVar();
        appVar.setType(newAppVar.getType());
        appVar.setAppId(newAppVar.getAppId());
        appVar.setPageId(newAppVar.getPageId());
        appVar.setScope(newAppVar.getScope());
        appVar.setName(newAppVar.getName());
        appVar.setValueType(newAppVar.getValueType());
        appVar.setDefaultValue(newAppVar.getDefaultValue());
        appVar.setPath(newAppVar.getPath());
        appVar.setIntro(newAppVar.getIntro());
        baseMapper.insert(appVar);
        return new IdRespVo(appVar.getId());
    }

    public void updateAppVar(String id, AppVarReqVo appVar){
        AppVar updateVar = new AppVar();
        updateVar.setId(id);
        // 只能更新名字，值类型，初始值, path
        LambdaQueryWrapper<AppVar> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(AppVar::getAppId, appVar.getAppId())
                .eq(AppVar::getPageId, appVar.getPageId())
                .eq(AppVar::getName, appVar.getName())
                .ne(AppVar::getId, id);
        Long existCount = baseMapper.selectCount(queryWrapper);
        if (existCount > 0) {
            throw new BaseException(ResultCode.ALREADY_EXISTS.getCode(), ResultCode.ALREADY_EXISTS.getMsg());
        }
        updateVar.setName(appVar.getName());
        updateVar.setValueType(appVar.getValueType());
        updateVar.setDefaultValue(appVar.getDefaultValue());
        updateVar.setPath(appVar.getPath());
        baseMapper.updateById(updateVar);
    }

    public void deleteAppVar(IdsReqVo idsReq){
        baseMapper.deleteBatchIds(Arrays.asList(idsReq.getIds()));
    }
    public void deleteVarsByAppId(String appId){
        LambdaQueryWrapper<AppVar> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(AppVar::getAppId, appId);
        baseMapper.delete(queryWrapper);
    }
}
