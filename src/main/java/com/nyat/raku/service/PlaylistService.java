package com.nyat.raku.service;

import com.nyat.raku.payload.PlaylistForm;

public interface PlaylistService {
    void create(PlaylistForm playlistForm);

    void update(PlaylistForm playlistForm);

    void delete(Integer id);
}
