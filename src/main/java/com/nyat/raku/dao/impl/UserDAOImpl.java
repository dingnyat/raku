package com.nyat.raku.dao.impl;

import com.nyat.raku.dao.UserDAO;
import com.nyat.raku.entity.User;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.List;

@Repository
@Transactional
public class UserDAOImpl implements UserDAO {
    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public User create(User user) {
        entityManager.persist(user);
        return user;
    }

    @Override
    public User get(Integer id) {
        return entityManager.find(User.class, id);
    }

    @Override
    public List<User> getAll() {
        return entityManager.createQuery("select u from User u", User.class).getResultList();
    }

    @Override
    public User update(User user) {
        entityManager.merge(user);
        return user;
    }

    @Override
    public void delete(User user) {
        entityManager.remove(user);
    }

    @Override
    public User getByUsername(String username) {
        try {
            return entityManager.createQuery("select u from User u where u.username = '" + username + "'", User.class).getSingleResult();
        } catch (Exception e) {
            return null;
        }
    }

    @Override
    public User getByEmail(String email) {
        try {
            return entityManager.createQuery("select u from User u where u.email = '" + email + "'", User.class).getSingleResult();
        } catch (Exception e) {
            return null;
        }
    }

    @Override
    public User getByVerificationKey(String key) {
        try {
            return entityManager.createQuery("select u from User u where u.emailVerificationKey = '" + key + "'", User.class).getSingleResult();
        } catch (Exception e) {
            return null;
        }
    }
}
