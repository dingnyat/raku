package com.nyat.raku.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.nyat.raku.util.Privacy;
import lombok.Data;

import java.util.Date;
import java.util.Set;

@Data
@JsonInclude(value = JsonInclude.Include.NON_NULL)
public class PlaylistDTO {
    private Integer id;
    private UserDTO createdBy;
    private Date createdTime;
    private String code;
    private String title;
    private Privacy privacy;
    private Set<TrackDTO> tracks;
}
