package com.nyat.raku.security;

public enum Role {
    ADMIN, MEMBER;

    public String getAuthorityName() {
        return "ROLE_" + name();
    }
}
