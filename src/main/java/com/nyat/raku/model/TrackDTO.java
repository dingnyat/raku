package com.nyat.raku.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.util.Set;

@Data
@JsonInclude(value = JsonInclude.Include.NON_NULL)
public class TrackDTO {
    private Integer id;
    private String title;
    private String code;
    private String ext;
    private String uploadTime;
    private UserDTO uploader;
    private String description;
    private Privacy privacy;
    private String imageUrl;
    private String composer;
    private String artist;
    private String duration;
    private Integer plays;
    private Set<String> tags;
    private Set<GenreDTO> genres;
}