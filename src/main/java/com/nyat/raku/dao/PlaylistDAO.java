package com.nyat.raku.dao;

import com.nyat.raku.entity.Playlist;

public interface PlaylistDAO {
    Playlist create(Playlist playlist);

    void update(Playlist playlist);

    void delete(Playlist playlist);

    Playlist get(Integer id);
}
