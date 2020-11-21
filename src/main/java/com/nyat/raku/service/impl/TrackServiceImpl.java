package com.nyat.raku.service.impl;

import com.nyat.raku.dao.GenreDAO;
import com.nyat.raku.dao.TrackDAO;
import com.nyat.raku.entity.Track;
import com.nyat.raku.model.GenreDTO;
import com.nyat.raku.model.TrackDTO;
import com.nyat.raku.model.UserDTO;
import com.nyat.raku.service.TrackService;
import com.nyat.raku.util.DateTimeUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class TrackServiceImpl implements TrackService {

    @Autowired
    private TrackDAO trackDAO;

    @Autowired
    private GenreDAO genreDAO;

    @Value("${raku.root-path}")
    private String storagePath;

    @Override
    public TrackDTO create(TrackDTO trackDTO) {
        Track track = new Track();
        track.setTitle(trackDTO.getTitle());
        track.setCode(trackDTO.getCode());
        track.setComposer(trackDTO.getComposer());
        track.setArtist(trackDTO.getArtist());
        track.setDescription(trackDTO.getDescription());
        track.setPlays(0);
        track.setPrivacy(trackDTO.getPrivacy());
        track.setDuration(trackDTO.getDuration());
        track.setImageUrl(trackDTO.getImageUrl());
        track.setExt(trackDTO.getExt());
        track.setTags(trackDTO.getTags());
        if (trackDTO.getGenres() != null) {
            track.setGenres(trackDTO.getGenres().stream().map(genreDTO -> genreDAO.get(genreDTO.getId())).collect(Collectors.toSet()));
        }
        trackDAO.create(track);
        UserDTO userDTO = new UserDTO();
        userDTO.setName(track.getUploader().getName());
        userDTO.setUsername(track.getUploader().getUsername());
        trackDTO.setUploader(userDTO);
        return trackDTO;
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

    @Override
    public TrackDTO getByCode(String username, String code) throws Exception {
        Track track = trackDAO.getByCode(username, code);
        TrackDTO trackDTO = new TrackDTO();
        trackDTO.setId(track.getId());
        trackDTO.setTitle(track.getTitle());
        trackDTO.setArtist(track.getArtist());
        trackDTO.setDuration(track.getDuration());
        trackDTO.setTags(track.getTags());
        trackDTO.setDescription(track.getDescription());
        trackDTO.setPrivacy(track.getPrivacy());
        trackDTO.setPlays(track.getPlays());
        trackDTO.setExt(track.getExt());
        trackDTO.setUploadTime(DateTimeUtils.formatDate(track.getUploadTime(), DateTimeUtils.DD_MM_YYYY));
        if (track.getImageUrl() != null) {
            trackDTO.setImageUrl(track.getImageUrl());
        }
        trackDTO.setComposer(track.getComposer());
        trackDTO.setCode(track.getCode());
        trackDTO.setGenres(track.getGenres().stream().map(genre -> {
            GenreDTO genreDTO = new GenreDTO();
            genreDTO.setId(genre.getId());
            genreDTO.setCode(genre.getCode());
            genreDTO.setName(genre.getName());
            return genreDTO;
        }).collect(Collectors.toSet()));
        UserDTO userDTO = new UserDTO();
        userDTO.setName(track.getUploader().getName());
        userDTO.setUsername(track.getUploader().getUsername());
        trackDTO.setUploader(userDTO);
        return trackDTO;
    }
}
