package com.cloudwise.lcap.commonbase.vo;


import java.util.List;
import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import lombok.Data;

@Data
public class ProjectReqVo {
    // 兼容dubbo接口
    private Long accountId;
    private Long userId;

    @NotBlank(message = "项目名称不能为空")
    private String name;

    private String desc;

    @Valid
    @NotEmpty(message="项目行业不能为空")
    private List<TradeVo> trades;
}
