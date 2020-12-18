package com.nyat.raku.dao;


import com.nyat.raku.entity.User;

import java.util.List;

public interface UserDAO {
    User create(User User);

    User get(Integer id);

    List<User> getAll();

    User update(User user);

    void delete(User user);

    User getByUsername(String username);

    User getByEmail(String email);

    User getByVerificationKey(String key);

    User getByResetPasswordToken(String token);
}
