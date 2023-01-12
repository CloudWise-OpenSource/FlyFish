package com.cloudwise.lcap.commonbase.vo;


import lombok.Data;

import javax.validation.constraints.NotBlank;

@Data
public class ApplicationUninstallReqVo {
    @NotBlank
    private String dashboardName;
}
