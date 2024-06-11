package com.cloudwise.lcap.controller;

import cn.hutool.core.util.StrUtil;
import cn.hutool.crypto.SecureUtil;
import cn.hutool.json.JSONObject;
import cn.hutool.json.JSONUtil;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.cloudwise.lcap.commonbase.base.PageResultOfOpenSource;
import com.cloudwise.lcap.commonbase.entity.BaseUser;
import com.cloudwise.lcap.commonbase.entity.Role;
import com.cloudwise.lcap.commonbase.exception.BaseException;
import com.cloudwise.lcap.commonbase.exception.BizException;
import com.cloudwise.lcap.commonbase.service.BaseUserService;
import com.cloudwise.lcap.commonbase.service.RoleService;
import com.cloudwise.lcap.commonbase.util.JwtUtils;
import com.cloudwise.lcap.commonbase.vo.MenusListVo;
import com.cloudwise.lcap.commonbase.vo.MenusVo;
import io.jsonwebtoken.Claims;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

/**
 * <p>
 * user前端控制器  RestController注解 将结果以JSON形式返回
 * </p>
 *
 * @author dana.wang
 * @since 2022-12-26
 */
@RestController
@RequestMapping("/users")
@Slf4j
public class BaseUserController {
    @Autowired
    public BaseUserService baseUserService;
    @Autowired
    public RoleService roleService;
    @Autowired
    private JwtUtils jwtUtils;

    /**
     * 注册用户
     *
     * @param user 修改或保存的对象
     * @return Result
     */
    @PostMapping("/register")
    public void save(@RequestBody BaseUser user) {
        try {
            LambdaQueryWrapper<BaseUser> eq = Wrappers.<BaseUser>lambdaQuery().eq(BaseUser::getUsername, user.getUsername());
            BaseUser one = baseUserService.getOne(eq);
            if (one != null) {
                throw new BizException("用户名重复，请重新注册");
            }
            String password = user.getPassword();
            if (password.length() < 6 || password.length() > 40) {
                throw new BizException("密码长度必须在6到40之间");
            }
            user.setPassword(SecureUtil.md5(password));
            user.setIsDouc(false);
            user.setStatus("valid");
            LambdaQueryWrapper<Role> eq2 = Wrappers.<Role>lambdaQuery().eq(Role::getName, "成员");
            Role role = roleService.getOne(eq2);
            user.setRoleId(role.getId());
            baseUserService.save(user);
        } catch (BaseException e) {
            log.error("用户名重复:{}", e.getMsg());
            throw new BaseException("用户名重复，请重新注册");
        } catch (Exception e) {
            log.error("保存用户异常:", e);
            throw new BizException("保存用户异常:" + e.getMessage());
        }
    }

    /**
     * 用户登录
     *
     * @param user 修改或保存的对象
     * @return Result
     */
    @PostMapping("/login")
    public JSONObject login(@RequestBody BaseUser user, HttpServletResponse response) {
        String password = user.getPassword();
        if (password.length() < 6 || password.length() > 40) {
            throw new BizException("密码长度必须在6到40之间");
        }
        LambdaQueryWrapper<BaseUser> eq = Wrappers.<BaseUser>lambdaQuery().eq(BaseUser::getUsername, user.getUsername()).eq(BaseUser::getPassword, SecureUtil.md5(user.getPassword()));
        BaseUser one = baseUserService.getOne(eq);
        if (one == null) {
            throw new BizException("用户名或密码错误");
        }
        String status = one.getStatus();
        if (StrUtil.isBlank(status) || StrUtil.equalsIgnoreCase("invalid", status)) {
            throw new BizException("用户状态已禁用");
        }
        LambdaQueryWrapper<Role> eq2 = Wrappers.<Role>lambdaQuery().eq(Role::getId, one.getRoleId()).eq(Role::getStatus, "valid");
        Role role = roleService.getOne(eq2);
        if (role == null) {
            throw new BizException("无角色分配，无权限");
        }
//            分配jwt-token放到cookie
        String token = jwtUtils.generateToken(one.getId());
        addCookie(token, response);
        JSONObject jsonObject = new JSONObject();
        jsonObject.set("id", one.getId());
        return jsonObject;
    }

    public void addCookie(String token, HttpServletResponse response) {
        //创建新cookie
        Cookie cookie = new Cookie("token", token);
        // 设置存在时间为一天
        cookie.setMaxAge(1 * 60 * 60 * 24);
        //设置作用域
        cookie.setPath("/");
        //将cookie添加到response的cookie数组中返回给客户端
        response.addCookie(cookie);
    }

    /**
     * 用户登出
     *
     * @return Result
     */
    @PostMapping("/logout")
    public void logout(@RequestParam(value = "id",required = false) String id, HttpServletResponse response) {
        Cookie cookie = new Cookie("token", null);
        cookie.setMaxAge(0);
        response.addCookie(cookie);
    }

    @PutMapping("/info/{id}")
    public void update(@PathVariable String id, @RequestBody BaseUser user, HttpServletRequest request) {
        try {
            String userId = getUserIdByToken(request);
            BaseUser baseUser = baseUserService.getBaseMapper().selectById(userId);
            // 只有超级管理员才能修改用户信息
            if (Objects.equals(baseUser.getRoleId(), "1")) {
                user.setId(id);
                String password = user.getPassword();
                if(StrUtil.isNotBlank(password)){
                    if (password.length() < 6 || password.length() > 40){
                        throw new BizException("密码长度必须在6到40之间");
                    }
                    user.setPassword(SecureUtil.md5(password));
                }
                baseUserService.updateById(user);
            } else {
                throw new BizException("无权限更新用户信息");
            }
        } catch (Exception e) {
            log.error("更新用户异常:", e);
            throw new BizException("更新用户信息异常");
        }
    }

    /**
     * 查询一个
     *
     * @param id 查找对象的主键ID
     * @return Result
     */
    @GetMapping("/info")
    public BaseUser findOne(String id) {
        try {
            BaseUser user = baseUserService.getById(id);
            if (user == null) {
                throw new BaseException("当前用户未查到");
            }
            String roleId = user.getRoleId();
            Role byId = roleService.getById(roleId);
            String menus = byId.getMenus();
            if (StrUtil.isNotBlank(menus)) {
                MenusListVo menusListVo = JSONUtil.toBean(menus, MenusListVo.class);
                List<MenusVo> menus1 = menusListVo.getMenus();
                user.setMenus(menus1);
            }
            if (StrUtil.equals(byId.getName(), "管理员")) {
                user.setIsAdmin(true);
            } else {
                user.setIsAdmin(false);
            }
            return user;
        } catch (Exception e) {
            log.error("查询用户异常:", e);
            throw new BizException("查询用户异常:" + e.getMessage());
        }
    }


    /**
     * 查询所有  ,未传当前页以及分页长度 则默认1页 10条数据
     *
     * @param user 查询的对象
     * @return Result
     */
    @PostMapping("/list")
    public PageResultOfOpenSource findList(@RequestBody BaseUser user) {
        try {
            Page<BaseUser> page = new Page<>(user.getCurPage(), user.getPageSize());
            LambdaQueryWrapper<BaseUser> queryWrapper = Wrappers.<BaseUser>lambdaQuery()
                    .like(StrUtil.isNotBlank(user.getUsername()), BaseUser::getUsername, user.getUsername())
                    .like(StrUtil.isNotBlank(user.getEmail()), BaseUser::getEmail, user.getEmail())
                    .like(StrUtil.isNotBlank(user.getStatus()), BaseUser::getStatus, user.getStatus())
                    .orderByDesc(BaseUser::getUpdateTime);
            Page<BaseUser> page1 = baseUserService.page(page, queryWrapper);
            PageResultOfOpenSource<BaseUser> rolePageResultOfOpenSource = new PageResultOfOpenSource<>(page1.getCurrent(), page1.getSize(), page1.getTotal(), page1.getRecords());
            return rolePageResultOfOpenSource;
        } catch (Exception e) {
            log.error("用户列表异常:", e);
            throw new BizException("用户列表异常:" + e.getMessage());
        }
    }
    
    /**
     * 获取用户Id
     * @return
     */
    private String getUserIdByToken(HttpServletRequest request) {
        String token = "";
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (cookie.getName().equals("token")) {
                    token = cookie.getValue();
                }
            }
        }
        
        if (StringUtils.isEmpty(token)) {
            log.error("获取用户信息失败");
            throw new BizException("获取用户信息失败");
        }
        Claims claim = jwtUtils.getClaimsByToken(token);
        return claim.getSubject();
    }
}