package com.nyat.raku.payload;

import com.nyat.raku.model.PlaylistDTO;
import lombok.Data;

import java.util.Set;

@Data
public class UserTrackInfo {
    private boolean like;
    private boolean repost;
    private Set<PlaylistDTO> playlists;
    private boolean followUploader;
}
