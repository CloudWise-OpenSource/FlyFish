package com.cloudwise.lcap.controller;


import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;

/**
 * <p>
 *  前端控制器
 * </p>
 *
 * @author june.yang
 * @since 2022-08-01
 */
@RestController
@RequestMapping("/users")
public class UserController {

    // 暂时关闭
    @GetMapping("/application-config/{id}")
    public Object appConfig () {
        return new HashMap();
    }

    // 暂时关闭
    @PutMapping("/application-config/{id}")
    public Object updateAppConfig () {
        return new HashMap();
    }

}
