package com.cloudwise.lcap.devserver.dto;

import lombok.*;

import java.io.Serializable;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class Manifest implements Serializable {

    //当 type=application时使用 ${applicationExportType} 处理 ${applicationList}
    //当 type=component 时使用 ${componentExportType} 处理 ${componentList}
    private String type;
    // appAndComponent
    private String applicationExportType;
    private List<ResourceApplicationDto> applicationList;

    //此时 type=component，需要设置组件的导出方式  componentRelease
    private List<String> componentExportType;
    private List<ResourceComponentDto> componentList;
    private String time;
    private Long creator;

}
