package com.cloudwise.lcap.source.dto;

import lombok.*;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class ComponentViewDto implements Serializable {

    private String id;
    private String name;
    private String type;
    private String version;
    private String developStatus;
    private List<String> projects;
    private List<String> projectsName;
    private String category;
    private String categoryName;
    private String subCategory;
    private boolean update;
    private String from;
    private Boolean isLab;
    private Integer allowDataSearch;
    private Date createTme;
    private String creator;
    private String desc;
}
