package com.nyat.raku.service.impl;

import com.nyat.raku.dao.TrackDAO;
import com.nyat.raku.entity.Track;
import com.nyat.raku.model.TrackDTO;
import com.nyat.raku.service.TrackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class TrackServiceImpl implements TrackService {

    @Autowired
    private TrackDAO trackDAO;

    @Value("${raku.root-path}")
    private String storagePath;

    @Override
    public Track create(TrackDTO trackDTO) {
        Track track = new Track();
        track.setTitle(trackDTO.getTitle());
        track.setCode(trackDTO.getCode());
        track.setComposer(trackDTO.getComposer());
        track.setDescription(trackDTO.getDescription());
        track.setPlays(0);
        track.setPrivacy(trackDTO.getPrivacy());
        trackDAO.create(track);
        return track;
    }

    @Override
    public TrackDTO get(Integer id) {
        return null;
    }

    @Override
    public List<TrackDTO> getAll() {
        return null;
    }

    @Override
    public void update(TrackDTO trackDTO) {

    }

    @Override
    public void delete(Integer id) {

    }
}
