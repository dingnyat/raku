package com.nyat.raku.payload;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
@JsonInclude(value = JsonInclude.Include.NON_NULL)
public class TrackFormData {
    private String tempAudioName;
    private String title;
    private String code;
    private String description;
    private String privacy;
    private MultipartFile image;
    private String cropData;
    private String duration;
    private String composer;
    private String artist;
    private String tags;
    private String genres;
}
