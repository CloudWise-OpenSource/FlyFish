package com.cloudwise.lcap.devserver.dto;

import lombok.*;

import java.io.Serializable;
import java.util.List;

/**
 * 导出组件和导出应用使用不同的接口,但参数封装都使用该对象
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class ApplicationExportRequest implements Serializable {
    //导出应用时使用该字段，从{appOnly,appComponentOnly,appAndComponent} 三个字段中取一种类型
    private String applicationExportType;
    //当初组件时使用该字段,从{componentSource componentRelease componentNodeModules} 三个字段中取若干种类型
    private List<String> componentExportType;

    //组件或应用的id
    private List<String> ids;
}
