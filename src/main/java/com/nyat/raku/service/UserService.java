package com.nyat.raku.service;


import com.nyat.raku.entity.User;
import com.nyat.raku.model.UserDTO;

import java.util.List;

public interface UserService {
    User create(UserDTO userDTO);

    UserDTO get(Integer id);

    List<UserDTO> getAll();

    void update(UserDTO userDTO);

    void delete(Integer id);

    boolean existsByEmail(String email);

    boolean existsByUsername(String username);

    UserDTO getByVerificationKey(String key);

    void verifyAccount(Integer id);

    UserDTO getByUsername(String username);

    void likeTrack(Integer trackId, String username);

    void repostTrack(Integer trackId, String username);

    void followUser(String followUsername, String actUsername);
}
