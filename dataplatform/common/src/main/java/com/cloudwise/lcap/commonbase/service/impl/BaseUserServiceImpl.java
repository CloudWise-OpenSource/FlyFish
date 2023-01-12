package com.cloudwise.lcap.commonbase.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.cloudwise.lcap.commonbase.entity.BaseUser;
import com.cloudwise.lcap.commonbase.mapper.BaseUserMapper;
import com.cloudwise.lcap.commonbase.service.BaseUserService;
import org.springframework.stereotype.Service;

/**
 * <p>
 * 用户表 服务实现类
 * </p>
 *
 * @author ${author}
 * @since 2022-12-26
 */
@Service
public class BaseUserServiceImpl extends ServiceImpl<BaseUserMapper, BaseUser> implements BaseUserService {

}
