package com.nyat.raku.dao.impl;

import com.nyat.raku.dao.GenreDAO;
import com.nyat.raku.entity.Genre;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.List;

@Repository
public class GenreDAOImpl implements GenreDAO {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Genre get(Integer id) {
        return entityManager.find(Genre.class, id);
    }

    @Override
    public List<Genre> getAll() {
        return entityManager.createQuery("select g from Genre g", Genre.class).getResultList();
    }

    @Override
    public Genre getByCode(String code) {
        try {
            return entityManager.createQuery("select g from Genre g where g.code = '" + code + "'", Genre.class).getSingleResult();
        } catch (Exception e) {
            return null;
        }
    }
}
