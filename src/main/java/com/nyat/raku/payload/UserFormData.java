package com.nyat.raku.payload;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
@JsonInclude(value = JsonInclude.Include.NON_NULL)
public class UserFormData {
    private MultipartFile image;
    private String cropData;
    private Integer id;
    private String name;
    private String bio;
    private String city;
    private String country;
}
