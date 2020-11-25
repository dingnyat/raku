package com.nyat.raku.model;

import com.nyat.raku.entity.User;
import lombok.Data;

import java.util.Set;

@Data
public class PlaylistDTO {
    private Integer id;
    private User createdBy;
    private String code;
    private String title;
    private Privacy privacy;
    private Set<TrackDTO> tracks;
}
