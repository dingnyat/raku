package com.nyat.raku.payload;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

@Data
@JsonInclude(value = JsonInclude.Include.NON_NULL)
public class TrackStats {
    private int plays;
    private int like;
    private int comment;
    protected int repost;
}
