package com.nyat.raku.dao.impl;

import com.nyat.raku.dao.PlaylistDAO;
import com.nyat.raku.entity.Playlist;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

@Repository
@Transactional
public class PlaylistDAOImpl implements PlaylistDAO {

    @PersistenceContext
    private EntityManager em;

    @Override
    public Playlist create(Playlist playlist) {
        em.persist(playlist);
        return playlist;
    }

    @Override
    public void update(Playlist playlist) {
        em.merge(playlist);
    }

    @Override
    public void delete(Playlist playlist) {
        em.remove(playlist);
    }

    @Override
    public Playlist get(Integer id) {
        return em.find(Playlist.class, id);
    }
}
