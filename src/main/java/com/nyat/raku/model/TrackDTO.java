package com.nyat.raku.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.nyat.raku.util.CropData;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.util.Set;

@Data
@JsonInclude(value = JsonInclude.Include.NON_NULL)
public class TrackDTO {
    public Integer id;
    public String title;
    public String code;
    public String src;
    public String uploadTime;
    public String description;
    public String privacy;
    public String imageUrl;
    public MultipartFile image;
    public String cropDataStr;
    public CropData cropData;
    public String composer;
    public String duration;
    public Integer plays;
    public Set<String> tags;
    public Set<GenreDTO> genres;
    public String genresStr;
}