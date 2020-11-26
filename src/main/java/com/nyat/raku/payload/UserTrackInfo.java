package com.nyat.raku.payload;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.nyat.raku.model.PlaylistDTO;
import lombok.Data;

import java.util.Set;

@Data
@JsonInclude(value = JsonInclude.Include.NON_NULL)
public class UserTrackInfo {
    private boolean like;
    private boolean repost;
    private Set<PlaylistDTO> playlists;
}
