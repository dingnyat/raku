package com.nyat.raku.service.impl;

import com.nyat.raku.dao.GenreDAO;
import com.nyat.raku.entity.Genre;
import com.nyat.raku.model.GenreDTO;
import com.nyat.raku.service.GenreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class GenreServiceImpl implements GenreService {

    @Autowired
    private GenreDAO genreDAO;

    @Override
    public GenreDTO get(Integer id) {
        Genre genre = genreDAO.get(id);
        if (genre == null) return null;
        GenreDTO genreDTO = new GenreDTO();
        genreDTO.setId(genre.getId());
        genreDTO.setCode(genre.getCode());
        genreDTO.setName(genre.getName());
        return genreDTO;
    }

    @Override
    public List<GenreDTO> getAll() {
        List<Genre> genres = genreDAO.getAll();
        if (genres != null) {
            return genres.stream().map(genre -> {
                GenreDTO genreDTO = new GenreDTO();
                genreDTO.setId(genre.getId());
                genreDTO.setCode(genre.getCode());
                genreDTO.setName(genre.getName());
                return genreDTO;
            }).collect(Collectors.toList());
        }
        return null;
    }

    @Override
    public GenreDTO getByCode(String code) {
        Genre genre = genreDAO.getByCode(code);
        if (genre == null) return null;
        GenreDTO genreDTO = new GenreDTO();
        genreDTO.setId(genre.getId());
        genreDTO.setCode(genre.getCode());
        genreDTO.setName(genre.getName());
        return genreDTO;
    }
}
