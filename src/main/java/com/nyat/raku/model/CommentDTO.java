package com.nyat.raku.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.util.Date;
import java.util.Set;

@Data
@JsonInclude(value = JsonInclude.Include.NON_NULL)
public class CommentDTO {
    private Integer id;
    private String content;
    private UserDTO uploader;
    private Date time;
    private Set<CommentDTO> children;
}
