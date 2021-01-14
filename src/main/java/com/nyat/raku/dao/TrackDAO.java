package com.nyat.raku.dao;

import com.nyat.raku.entity.Track;
import com.nyat.raku.payload.SearchPayload;
import com.nyat.raku.payload.SearchResult;

import java.util.Arrays;
import java.util.List;

public interface TrackDAO {
    Track create(Track Track);

    Track get(Integer id);

    List<Track> getAll();

    Track update(Track user);

    void delete(Track user);

    Track getByCode(String username, String code);

    SearchResult search(SearchPayload searchPayload);

    List<Track> getTracksByTag(String tagCode);

    List<Track> getTop40();
}
