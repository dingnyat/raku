package com.nyat.raku.payload;

import lombok.Data;

@Data
public class SignUpReq {
    private String email;
    private String password;
    private String username;
    private String name;
}
