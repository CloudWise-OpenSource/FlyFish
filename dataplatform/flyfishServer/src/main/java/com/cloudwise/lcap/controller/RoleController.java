package com.cloudwise.lcap.controller;

import cn.hutool.core.bean.BeanUtil;
import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSONObject;
import cn.hutool.json.JSONUtil;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.cloudwise.lcap.commonbase.base.PageResultOfOpenSource;
import com.cloudwise.lcap.commonbase.dto.RoleMenusDto;
import com.cloudwise.lcap.commonbase.dto.UserIdDto;
import com.cloudwise.lcap.commonbase.entity.BaseUser;
import com.cloudwise.lcap.commonbase.entity.Role;
import com.cloudwise.lcap.commonbase.exception.BizException;
import com.cloudwise.lcap.commonbase.service.BaseUserService;
import com.cloudwise.lcap.commonbase.service.MenusService;
import com.cloudwise.lcap.commonbase.service.RoleService;
import com.cloudwise.lcap.commonbase.vo.MenusListVo;
import com.cloudwise.lcap.commonbase.vo.MenusVo;
import com.cloudwise.lcap.commonbase.vo.RoleVo;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.Charset;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

/**
 * <p>
 * role前端控制器  RestController注解 将结果以JSON形式返回
 * </p>
 *
 * @author dana.wang
 * @since 2022-12-26
 */
@RestController
@RequestMapping("/roles")
@Slf4j
public class RoleController {
    @Autowired
    public RoleService roleService;
    @Autowired
    public MenusService menusService;
    @Autowired
    public BaseUserService baseUserService;

    /**
     * 保存角色
     *
     * @param role 修改或保存的对象
     * @return Result
     */
    @PostMapping
    public void save(@RequestBody Role role) {
        LambdaQueryWrapper<Role> eq = Wrappers.<Role>lambdaQuery().eq(StrUtil.isNotBlank(role.getName()), Role::getName, role.getName());
        Role one = roleService.getOne(eq);

        if (one != null) {
            throw new BizException("角色已存在");
        }
        role.setStatus("valid");
        JSONObject jsonObject = new JSONObject();
        jsonObject.set("menus",JSONUtil.createArray());
        role.setMenus(JSONUtil.toJsonStr(jsonObject));
        roleService.save(role);
    }

    /**
     * 修改角色
     *
     * @param role 修改或保存的对象
     * @return Result
     */
    @PutMapping("/{id}/basic")
    public void update(@PathVariable Long id, @RequestBody Role role) {
        try {
//            LambdaUpdateWrapper<Role> lambdaUpdateWrapper = new LambdaUpdateWrapper<>();
//            lambdaUpdateWrapper.eq(Role::getId, id)
//                    .set(StrUtil.isNotBlank(role.getName()), Role::getName, role.getName())
//                    .set(StrUtil.isNotBlank(role.getDesc()), Role::getDesc, role.getDesc())
//                    .set(StrUtil.isNotBlank(role.getMenus()), Role::getMenus, role.getMenus())
//                    .set(StrUtil.isNotBlank(role.getStatus()), Role::getStatus, role.getStatus())
//                    .set(role.getUpdater()!=null, Role::getUpdater, role.getUpdater())
//                    .set(role.getCreator()!=null, Role::getCreator, role.getCreator());
//            roleService.update(null, lambdaUpdateWrapper);
            role.setId(StrUtil.str(id, Charset.defaultCharset()));
            roleService.updateById(role);
        } catch (Exception e) {
            log.error("basic更新角色异常:", e);
            throw new BizException("basic更新角色异常:" + e.getMessage());
        }
    }

    /**
     * 查询角色
     *
     * @param id
     * @return Result
     */
    @GetMapping("/info/{id}")
    public RoleVo findOne(@PathVariable Long id) {
        try {
            Role byId = roleService.getById(id);
            RoleVo roleVo = new RoleVo();
            String menus = byId.getMenus();
            if (StrUtil.isNotBlank(menus)) {
                MenusListVo menusListVo = JSONUtil.toBean(menus, MenusListVo.class);
                List<MenusVo> menus1 = menusListVo.getMenus();
                roleVo.setMenus(menus1);
            }
            List<BaseUser> list = baseUserService.list(Wrappers.<BaseUser>lambdaQuery().eq(BaseUser::getRoleId, byId.getId()).eq(BaseUser::getStatus, "valid"));
            roleVo.setMembers(list);
            roleVo.setId(byId.getId());
            roleVo.setName(byId.getName());
            roleVo.setStatus(byId.getStatus());
            roleVo.setCreateTime(byId.getCreateTime());
            roleVo.setUpdateTime(byId.getUpdateTime());
            return roleVo;
        } catch (Exception e) {
            log.error("info查询角色异常:", e);
            throw new BizException("info查询角色异常:" + e.getMessage());
        }
    }

    /**
     * 修改角色
     *
     * @param dto 修改或保存的对象
     * @return Result
     */
    @PutMapping("/{id}/auth")
    public void updateAuth(@PathVariable("id") String id, @RequestBody RoleMenusDto dto) {
        try {
            Role role = new Role();
            role.setId(id);
            role.setDesc("12");
            List<MenusVo> menus = dto.getMenus();
            if (CollUtil.isNotEmpty(menus)) {
                JSONObject jsonObject = new JSONObject();
                jsonObject.set("menus", menus);
                role.setMenus(JSONUtil.toJsonStr(jsonObject));
            }
            LambdaUpdateWrapper<Role> lambdaUpdateWrapper = new LambdaUpdateWrapper<>();
            lambdaUpdateWrapper.eq(Role::getId, id).set(Role::getMenus, role.getMenus());
            roleService.update(null, lambdaUpdateWrapper);
        } catch (Exception e) {
            log.error("auth更新角色异常:", e);
            throw new BizException("auth更新角色异常:" + e.getMessage());
        }
    }

    /**
     * 修改members
     *
     * @return Result
     */
    @PutMapping("/{id}/members")
    public void updateMembers(@PathVariable String id, @RequestBody UserIdDto userIdDto) {
        try {
            List<String> members = userIdDto.getMembers();
            if (CollUtil.isNotEmpty(members)) {
                List<BaseUser> baseUsers = baseUserService.getBaseMapper().selectBatchIds(members);
                baseUsers.forEach(x -> {
                    x.setRoleId(id);
                    x.setUpdateTime(x.getUpdateTime());
                });
                baseUserService.saveOrUpdateBatch(baseUsers);
            }
        } catch (Exception e) {
            log.error("修改members异常:", e);
            throw new BizException("修改members异常:" + e.getMessage());
        }
    }

    /**
     * 删除单个
     *
     * @return Result
     */
    @DeleteMapping("/{id}")
    public void deleteById(@PathVariable Long id) {
        List<BaseUser> list = baseUserService.list(Wrappers.<BaseUser>lambdaQuery().eq(BaseUser::getRoleId, id).eq(BaseUser::getStatus, "valid"));
        if (CollUtil.isNotEmpty(list)) {
            throw new BizException("删除失败, 该角色中存在正常用户");
        }
        roleService.getBaseMapper().deleteById(id);
    }


    /**
     * 查询一个
     *
     * @param id 查找对象的主键ID
     * @return Result
     */
    @GetMapping("/findOne")
    public Role findOne(Integer id) {
        try {
            Role role = roleService.getById(id);
            return role;
        } catch (Exception e) {
            log.error("查询角色异常:", e);
            throw new BizException("查询角色异常:" + e.getMessage());
        }
    }


    /**
     * 查询所有  ,未传当前页以及分页长度 则默认1页 10条数据
     *
     * @param role 查询的对象
     * @return Result
     */
    @PostMapping("/list")
    public PageResultOfOpenSource findList(@RequestBody Role role) {
        try {
            Page<Role> page = new Page<>(role.getCurPage(), role.getPageSize());
            if (StrUtil.isNotBlank(role.getName())) {
                LambdaQueryWrapper<Role> eq = Wrappers.<Role>lambdaQuery().like(StrUtil.isNotBlank(role.getName()), Role::getName, role.getName());
                Page<Role> page1 = roleService.page(page, eq);
                List<Role> records = page1.getRecords();
                List<RoleVo> collect = records.stream().map(x -> {
                    RoleVo roleVo = new RoleVo();
                    BeanUtil.copyProperties(x, roleVo, new String[]{"menus"});
                    String menus = x.getMenus();
                    if (StrUtil.isNotBlank(menus)) {
                        MenusListVo menusListVo = JSONUtil.toBean(menus, MenusListVo.class);
                        List<MenusVo> menus1 = menusListVo.getMenus();
                        roleVo.setMenus(menus1);
                    }
                    return roleVo;
                }).collect(Collectors.toList());
                collect = collect.stream().sorted(Comparator.comparing(RoleVo::getUpdateTime).reversed()).collect(Collectors.toList());
                PageResultOfOpenSource<RoleVo> rolePageResultOfOpenSource = new PageResultOfOpenSource<>(page1.getCurrent(), page1.getSize(), page1.getTotal(), collect);
                return rolePageResultOfOpenSource;
            } else {
                Page<Role> page1 = roleService.page(page);
                List<Role> records = page1.getRecords();
                List<RoleVo> collect = records.stream().map(x -> {
                    RoleVo roleVo = new RoleVo();
                    BeanUtil.copyProperties(x, roleVo, new String[]{"menus"});
                    String menus = x.getMenus();
                    if (StrUtil.isNotBlank(menus)) {
                        MenusListVo menusListVo = JSONUtil.toBean(menus, MenusListVo.class);
                        List<MenusVo> menus1 = menusListVo.getMenus();
                        roleVo.setMenus(menus1);
                    }
                    return roleVo;
                }).collect(Collectors.toList());
                collect = collect.stream().sorted(Comparator.comparing(RoleVo::getUpdateTime).reversed()).collect(Collectors.toList());
                PageResultOfOpenSource<RoleVo> rolePageResultOfOpenSource = new PageResultOfOpenSource<>(page1.getCurrent(), page1.getSize(), page1.getTotal(), collect);
                return rolePageResultOfOpenSource;
            }
        } catch (Exception e) {
            log.error("list角色列表异常:", e);
            throw new BizException("list角色列表异常:" + e.getMessage());
        }
    }

    /**
     * @return Result
     */
    @GetMapping("/get-all")
    public List<Role> findList() {
        try {
            return roleService.list();
        } catch (Exception e) {
            log.error("get-all角色列表异常:", e);
            throw new BizException("get-all角色列表异常:" + e.getMessage());
        }
    }
}