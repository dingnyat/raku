package com.nyat.raku.service;

import com.nyat.raku.model.PlaylistDTO;
import com.nyat.raku.payload.PlaylistForm;

public interface PlaylistService {
    PlaylistDTO getByCode(String username, String code);

    void create(PlaylistForm playlistForm);

    void update(PlaylistForm playlistForm);

    void delete(Integer id);
}
