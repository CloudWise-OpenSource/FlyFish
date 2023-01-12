package com.cloudwise.lcap.commonbase.entity;

import com.baomidou.mybatisplus.annotation.*;
import com.cloudwise.lcap.commonbase.vo.MenusVo;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

/**
 * <p>
 *  菜单实体类
 * </p>
 *
 * @author dana.wang
 * @since 2022-12-26
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
@TableName("menus")
@EqualsAndHashCode(callSuper = false)
public class Menus implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * id
     */
    @TableId(value = "id", type = IdType.AUTO)
    private Integer id;

    /**
     * 父id
     */
    @TableField("`parent_menu_id`")
    private Integer parentMenuId;

    /**
     * 菜单名称
     */
    private String name;

    /**
     * 菜单url
     */
    private String url;

    @TableField(exist = false)
    private List<MenusVo> children;

    /**
     * 更新人
     */
    private Long updater;

    /**
     * 创建人
     */
    private Long creator;

    /**
     * 创建时间
     */
    @TableField(fill = FieldFill.INSERT)
    @DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date createTime;

    /**
     * 更新时间
     */
    @TableField(fill = FieldFill.INSERT_UPDATE,update = "now()")
    @DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date updateTime;


}
