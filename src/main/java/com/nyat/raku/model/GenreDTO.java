package com.nyat.raku.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

@Data
@JsonInclude(value = JsonInclude.Include.NON_NULL)
public class GenreDTO {
    private Integer id;
    private String code;
    private String name;
}
