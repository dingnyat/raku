package com.nyat.raku.payload;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

@Data
@JsonInclude(value = JsonInclude.Include.NON_NULL)
public class UserStats {
    private int following;
    private int followers;
    private int tracks;
    private boolean youFollowing;
}
