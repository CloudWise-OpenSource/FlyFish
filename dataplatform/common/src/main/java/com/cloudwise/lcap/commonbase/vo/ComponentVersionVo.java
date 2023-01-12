package com.cloudwise.lcap.commonbase.vo;

import lombok.Data;
import java.util.Date;

@Data
public class ComponentVersionVo {
    private String id;
    private String no;
    private String desc;
    private Date time;
}
