package com.nyat.raku.dao;

import com.nyat.raku.entity.Genre;

import java.util.List;

public interface GenreDAO {
    Genre get(Integer id);

    List<Genre> getAll();

    Genre getByCode(String code);
}
