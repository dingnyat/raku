package com.nyat.raku.service;

import com.nyat.raku.model.PlaylistDTO;
import com.nyat.raku.model.TrackDTO;
import com.nyat.raku.payload.TrackStats;
import com.nyat.raku.payload.UserTrackInfo;

import java.util.List;

public interface TrackService {
    TrackDTO create(TrackDTO trackDTO);

    TrackDTO get(Integer id);

    List<TrackDTO> getAll();

    void update(TrackDTO trackDTO);

    void delete(Integer id);

    TrackDTO getByCode(String username, String code) throws Exception;

    UserTrackInfo getUserTrackInfo(String uploader, String code, String username);

    TrackStats getTrackStats(String username, String code) throws Exception;

    List<TrackDTO> getTracksOf(String username);

    List<TrackDTO> getRepostTracksOf(String username);

    List<PlaylistDTO> getPlaylistsOf(String username);
}
