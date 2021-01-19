package com.nyat.raku.payload;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.nyat.raku.util.Privacy;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.util.Set;

@Data
@JsonInclude(value = JsonInclude.Include.NON_NULL)
public class PlaylistForm {
    private Integer id;
    private String code;
    private String title;
    private Privacy privacy;
    private Set<String> tracks;
    private MultipartFile image;
    private String cropData;
    private String description;
}
