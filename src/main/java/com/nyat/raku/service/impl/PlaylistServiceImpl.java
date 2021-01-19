package com.nyat.raku.service.impl;

import com.nyat.raku.dao.PlaylistDAO;
import com.nyat.raku.dao.UserDAO;
import com.nyat.raku.entity.Playlist;
import com.nyat.raku.payload.PlaylistForm;
import com.nyat.raku.security.AdvancedSecurityContextHolder;
import com.nyat.raku.security.UserPrincipal;
import com.nyat.raku.service.PlaylistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;

@Service
@Transactional
public class PlaylistServiceImpl implements PlaylistService {

    @Autowired
    private PlaylistDAO playlistDAO;

    @Autowired
    private UserDAO userDAO;

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
