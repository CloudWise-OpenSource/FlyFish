package com.cloudwise.lcap.controller;

import com.cloudwise.lcap.commonbase.entity.Menus;
import com.cloudwise.lcap.commonbase.exception.BizException;
import com.cloudwise.lcap.commonbase.service.MenusService;
import com.cloudwise.lcap.commonbase.vo.MenusVo;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

/**
 * <p>
 * menus前端控制器  RestController注解 将结果以JSON形式返回
 * </p>
 *
 * @author dana.wang
 * @since 2022-12-26
 */
@RestController
@RequestMapping("/menus")
@Slf4j
public class MenusController {
    @Autowired
    public MenusService menusService;

    /**
     * 保存修改公用 POST请求方式
     *
     * @param menus 修改或保存的对象
     * @return Result
     */
    @PostMapping("/save")
    public void save(@RequestBody Menus menus) {
        if (menus.getId() != null) {
            try {
                menusService.updateById(menus);
            } catch (Exception e) {
                log.error("更新菜单异常:", e);
                throw new BizException("更新菜单异常:" + e.getMessage());
            }
        } else {
            try {
                menusService.save(menus);
            } catch (Exception e) {
                log.error("保存菜单异常:", e);
                throw new BizException("保存菜单异常:" + e.getMessage());
            }
        }
    }


    /**
     * 查询一个
     *
     * @param id 查找对象的主键ID
     * @return Result
     */
    @GetMapping("/findOne")
    public Menus findOne(Integer id) {
        try {
            Menus menus = menusService.getById(id);
            return menus;
        } catch (Exception e) {
            log.error("查询菜单异常:", e);
            throw new BizException("查询菜单异常:" + e.getMessage());
        }
    }


    /**
     * 查询所有  ,未传当前页以及分页长度 则默认1页 10条数据
     *
     * @return List<MenusVo>
     */
    @GetMapping("/list")
    public List<MenusVo> findList() {
        try {
            List<Menus> allList = menusService.list();
            //获取一级菜单（parent_id==null的是一级菜单）
            List<MenusVo> rootList = allList
                    .stream()
                    .filter(s -> s.getParentMenuId() == null)
                    .map(x -> {
                        MenusVo menusVo = new MenusVo();
                        menusVo.setIndex(x.getId());
                        menusVo.setName(x.getName());
                        menusVo.setUrl(x.getUrl());
                        menusVo.setChildren(x.getChildren());
                        return menusVo;
                    })
                    .peek(s -> s.setChildren(getChilden(s, allList)))
                    .collect(Collectors.toList());
            return rootList;
        } catch (Exception e) {
            log.error("菜单列表异常:", e);
            throw new BizException("菜单列表异常:" + e.getMessage());
        }
    }

    /**
     * 递归获取子菜单
     *
     * @param menu    上级菜单
     * @param allList 用户的所有菜单项
     * @return 子菜单列表
     */
    private List<MenusVo> getChilden(MenusVo menu, List<Menus> allList) {
        List<MenusVo> childList = allList
                .stream()
                .filter(s -> menu.getIndex().equals(s.getParentMenuId()))
                .map(x -> {
                    MenusVo menusVo = new MenusVo();
                    menusVo.setIndex(x.getId());
                    menusVo.setName(x.getName());
                    menusVo.setUrl(x.getUrl());
                    menusVo.setChildren(x.getChildren());
                    return menusVo;
                })
                .peek(s -> s.setChildren(getChilden(s, allList)))
                .collect(Collectors.toList());
        return childList;
    }
}