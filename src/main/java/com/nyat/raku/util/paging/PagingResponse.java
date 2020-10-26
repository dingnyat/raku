package com.nyat.raku.util.paging;

import lombok.Data;

import java.util.List;

@Data
public class PagingResponse<T> {
    private int draw;
    private int totalDraw;
    private int recordsTotal;
    private int recordsFiltered;
    private List<T> data;
}
