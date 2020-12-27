package com.nyat.raku.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

@Data
@JsonInclude(value = JsonInclude.Include.NON_NULL)
public class PlanDTO {
    private Integer id;
    private String name;
    private String description;
    private String price;
}
