package com.nyat.raku.controller;

import com.nyat.raku.model.GenreDTO;
import com.nyat.raku.payload.ApiResponse;
import com.nyat.raku.service.GenreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

@Controller
@RequestMapping("/api/genre")
public class GenreController {

    @Autowired
    private GenreService genreService;

    @GetMapping("/get-all")
    @ResponseBody
    public ApiResponse<List<GenreDTO>> getAll() {
        List<GenreDTO> genres = genreService.getAll();
        return new ApiResponse<>(true, genres);
    }

    @GetMapping("/get-by-code/{code}")
    public ApiResponse<GenreDTO> getByCode(@PathVariable("code") String code) {
        GenreDTO genre = genreService.getByCode(code);
        return new ApiResponse<>(true, genre);
    }
}
