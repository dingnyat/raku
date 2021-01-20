package com.nyat.raku.service.impl;

import com.nyat.raku.dao.PlaylistDAO;
import com.nyat.raku.dao.UserDAO;
import com.nyat.raku.entity.Playlist;
import com.nyat.raku.entity.User;
import com.nyat.raku.model.PlaylistDTO;
import com.nyat.raku.model.TrackDTO;
import com.nyat.raku.model.UserDTO;
import com.nyat.raku.payload.PlaylistForm;
import com.nyat.raku.security.AdvancedSecurityContextHolder;
import com.nyat.raku.security.UserPrincipal;
import com.nyat.raku.service.PlaylistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.stream.Collectors;

@Service
@Transactional
public class PlaylistServiceImpl implements PlaylistService {

    @Autowired
    private PlaylistDAO playlistDAO;

    @Autowired
    private UserDAO userDAO;

    @Override
    public PlaylistDTO getByCode(String username, String code) {
        Playlist playlist = playlistDAO.getByCode(username, code);
        PlaylistDTO p = new PlaylistDTO();
        p.setId(playlist.getId());
        p.setTitle(playlist.getTitle());
        p.setCode(playlist.getCode());
        p.setPrivacy(playlist.getPrivacy());
        UserDTO userDTO = new UserDTO();
        userDTO.setUsername(playlist.getCreatedBy().getUsername());
        userDTO.setName(playlist.getCreatedBy().getName());
        userDTO.setImageUrl(playlist.getCreatedBy().getImageUrl());
        p.setCreatedBy(userDTO);
        p.setCreatedTime(playlist.getCreatedTime());
        p.setTracks(playlist.getTracks().stream().map(k -> {
            TrackDTO trackDTO = new TrackDTO();
            trackDTO.setCode(k.getCode());
            trackDTO.setTitle(k.getTitle());
            trackDTO.setImageUrl(k.getImageUrl());
            trackDTO.setPlays(k.getPlays());
            UserDTO u = new UserDTO();
            u.setName(k.getUploader().getName());
            u.setUsername(k.getUploader().getUsername());
            u.setImageUrl(k.getUploader().getImageUrl());
            trackDTO.setUploader(u);
            return trackDTO;
        }).collect(Collectors.toSet()));
        return p;
    }

    @Override
    public void create(PlaylistForm playlistForm) {
        if (AdvancedSecurityContextHolder.isLoggedIn()) {
            UserPrincipal userPrincipal = AdvancedSecurityContextHolder.getUserPrincipal();
            if (userPrincipal != null) {
                Playlist playlist = new Playlist();
                playlist.setCreatedTime(new Date());
                playlist.setCreatedBy(userDAO.getByUsername(userPrincipal.getUsername()));
                playlist.setPrivacy(playlistForm.getPrivacy());
                playlist.setCode(playlistForm.getCode());
                playlist.setTitle(playlistForm.getTitle());
                playlistDAO.create(playlist);
            }
        }
    }

    @Override
    public void update(PlaylistForm playlistForm) {
        Playlist playlist = playlistDAO.get(playlistForm.getId());
        playlist.setPrivacy(playlistForm.getPrivacy());
        playlist.setCode(playlistForm.getCode());
        playlist.setTitle(playlistForm.getTitle());
        playlistDAO.update(playlist);
    }

    @Override
    public void delete(Integer id) {
        Playlist playlist = playlistDAO.get(id);
        playlistDAO.delete(playlist);
    }
}
