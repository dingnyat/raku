package com.nyat.raku.util.paging;

import lombok.Data;

@Data
public class PagingRequest {
    private int draw;
    private int length;
    private int start;
    private Boolean desc;
    private String orderBy;
}
