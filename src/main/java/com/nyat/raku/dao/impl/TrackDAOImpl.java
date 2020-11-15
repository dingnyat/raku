package com.nyat.raku.dao.impl;

import com.nyat.raku.dao.TrackDAO;
import com.nyat.raku.entity.Track;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.List;

@Repository
public class TrackDAOImpl implements TrackDAO {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Track create(Track track) {
        entityManager.persist(track);
        return track;
    }

    @Override
    public Track get(Integer id) {
        return entityManager.find(Track.class, id);
    }

    @Override
    public List<Track> getAll() {
        return entityManager.createQuery("select t from Track t", Track.class).getResultList();
    }

    @Override
    public Track update(Track track) {
        entityManager.merge(track);
        return track;
    }

    @Override
    public void delete(Track track) {
        entityManager.remove(track);
    }
}
