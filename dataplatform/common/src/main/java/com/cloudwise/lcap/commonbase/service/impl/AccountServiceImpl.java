package com.cloudwise.lcap.commonbase.service.impl;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.cloudwise.lcap.commonbase.entity.Account;
import com.cloudwise.lcap.commonbase.mapper.AccountMapper;
import com.cloudwise.lcap.commonbase.service.IAccountService;
import org.springframework.stereotype.Service;

/**
 * <p>
 *  服务实现类
 * </p>
 *
 * @author luke.miao
 * @since 2022-08-10
 */
@Service
public class AccountServiceImpl extends ServiceImpl<AccountMapper, Account> implements IAccountService { }
