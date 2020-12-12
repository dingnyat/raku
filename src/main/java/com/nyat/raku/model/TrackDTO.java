package com.nyat.raku.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.nyat.raku.util.Privacy;
import lombok.Data;

import java.util.Date;
import java.util.Set;

@Data
@JsonInclude(value = JsonInclude.Include.NON_NULL)
public class TrackDTO {
    private Integer id;
    private String title;
    private String code;
    private String ext;
    private Date uploadTime;
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
    private Set<CommentDTO> comments;
}