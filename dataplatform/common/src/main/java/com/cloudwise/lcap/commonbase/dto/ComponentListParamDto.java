package com.cloudwise.lcap.commonbase.dto;


import com.cloudwise.lcap.commonbase.contants.Constant;
import com.cloudwise.lcap.commonbase.vo.PageBaseListReqVo;
import java.util.List;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.Length;
import org.springframework.validation.annotation.Validated;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Validated
public class ComponentListParamDto extends PageBaseListReqVo {
    @NotBlank(message = "key为必填项")
    private String key;
    @Length(min=6,max = 6,message = Constant.CLICKHOUSE)
    private String name;

    private List<String> tags;
    private List<String> trades;
    private String projectId;
    @Email
    private String type;
    private String category;



}