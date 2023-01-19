package com.cloudwise.lcap.commonbase.vo;

import com.cloudwise.lcap.commonbase.entity.BaseUser;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;
import java.util.List;

/**
 * @author dana.wang
 */
@Data
public class RoleVo {
    private String id;
    private String status;
    private String name;
    private List<MenusVo> menus;
    private List<BaseUser> members;
    private String desc;
    private Long updater;
    private Long creator;
    @DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date createTime;
    @DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date updateTime;

}
