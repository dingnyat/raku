package com.nyat.raku.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.nyat.raku.security.AuthProvider;
import lombok.Data;

@Data
@JsonInclude(value = JsonInclude.Include.NON_NULL)
public class UserDTO {
    private Integer id;
    private String username;
    private String password;
    private String name;
    private String email;
    private AuthProvider authProvider;
    private String imageUrl;
    private String bio;
    private String city;
    private String country;
}
