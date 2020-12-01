package com.nyat.raku.dao.impl;

import com.nyat.raku.dao.CommentDAO;
import com.nyat.raku.entity.Comment;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

@Repository
@Transactional
public class CommentDAOImpl implements CommentDAO {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Comment create(Comment comment) {
        entityManager.persist(comment);
        return comment;
    }

    @Override
    public Comment get(Integer id) {
        return entityManager.find(Comment.class, id);
    }

    @Override
    public void remove(Comment comment) {
        entityManager.remove(comment);
    }
}
