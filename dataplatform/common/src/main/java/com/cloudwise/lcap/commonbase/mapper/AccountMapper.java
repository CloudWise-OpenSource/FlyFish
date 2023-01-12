package com.cloudwise.lcap.commonbase.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.cloudwise.lcap.commonbase.entity.Account;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

/**
 * @author JD
 */
@Mapper
@Repository
public interface AccountMapper extends BaseMapper<Account> {


    Account queryById(@Param("accountId") String accountId);

}
