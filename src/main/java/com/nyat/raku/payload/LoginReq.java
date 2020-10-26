package com.nyat.raku.payload;

import lombok.Data;

import javax.validation.constraints.NotNull;

@Data
public class LoginReq {
    @NotNull
    private String username;
    @NotNull
    private String password;
}
