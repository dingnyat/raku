package com.nyat.raku.service;

import com.nyat.raku.entity.Track;
import com.nyat.raku.model.TrackDTO;

import java.util.List;

public interface TrackService {
    Track create(TrackDTO trackDTO);

    TrackDTO get(Integer id);

    List<TrackDTO> getAll();

    void update(TrackDTO trackDTO);

    void delete(Integer id);
}
