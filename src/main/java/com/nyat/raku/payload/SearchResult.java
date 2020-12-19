package com.nyat.raku.payload;

import com.fasterxml.jackson.annotation.JsonInclude;
import javafx.util.Pair;
import lombok.Data;

import java.util.LinkedList;
import java.util.List;

@Data
@JsonInclude(value = JsonInclude.Include.NON_NULL)
public class SearchResult {
    private List<Pair<?, String>> results;

    public SearchResult() {
        this.results = new LinkedList<>();
    }
}
