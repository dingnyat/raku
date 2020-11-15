package com.nyat.raku.service;


import com.nyat.raku.model.GenreDTO;

import java.util.List;

public interface GenreService {
    GenreDTO get(Integer id);

    List<GenreDTO> getAll();

    GenreDTO getByCode(String code);
}
