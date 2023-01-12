package com.cloudwise.lcap.commonbase.dto;

import com.cloudwise.lcap.commonbase.vo.MenusVo;
import lombok.Data;

import java.util.List;

/**
 * @author dana.wang
 */
@Data
public class RoleMenusDto {
    private List<MenusVo> menus;
}
