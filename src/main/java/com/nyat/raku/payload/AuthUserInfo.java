package com.nyat.raku.payload;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class AuthUserInfo {
    private String username;
    private String name;
    private String imageUrl;
    private String role;
}
