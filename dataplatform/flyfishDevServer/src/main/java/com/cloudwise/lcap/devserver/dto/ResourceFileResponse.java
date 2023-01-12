package com.cloudwise.lcap.devserver.dto;

import lombok.*;

import java.io.Serializable;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class ResourceFileResponse implements Serializable {

    private Boolean exist = false;
    private String fileName;

}
