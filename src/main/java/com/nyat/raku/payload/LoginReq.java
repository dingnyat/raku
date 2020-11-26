package com.nyat.raku.payload;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import javax.validation.constraints.NotNull;

@Data
@JsonInclude(value = JsonInclude.Include.NON_NULL)
public class LoginReq {
    @NotNull
    private String username;
    @NotNull
    private String password;
}
