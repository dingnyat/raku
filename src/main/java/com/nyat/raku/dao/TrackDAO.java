package com.nyat.raku.dao;

import com.nyat.raku.entity.Track;

import java.util.List;

public interface TrackDAO {
    Track create(Track Track);

    Track get(Integer id);

    List<Track> getAll();

    Track update(Track user);

    void delete(Track user);

    Track getByCode(String username, String code);
}
