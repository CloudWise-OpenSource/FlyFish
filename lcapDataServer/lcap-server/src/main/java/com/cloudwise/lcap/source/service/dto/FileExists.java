package com.cloudwise.lcap.source.service.dto;

import lombok.*;

import java.io.Serializable;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class FileExists implements Serializable {

    private Boolean exist = false;
    private String fileName;

}
