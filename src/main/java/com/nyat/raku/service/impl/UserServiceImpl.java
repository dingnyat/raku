package com.nyat.raku.service.impl;

import com.nyat.raku.dao.UserDAO;
import com.nyat.raku.entity.User;
import com.nyat.raku.model.UserDTO;
import com.nyat.raku.security.Role;
import com.nyat.raku.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class UserServiceImpl implements UserService {
    @Autowired
    private UserDAO userDAO;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public User create(UserDTO userDTO) {
        User user = new User();
        user.setName(userDTO.getName());
        user.setEmail(userDTO.getEmail());
        user.setEncodedPassword(passwordEncoder.encode(userDTO.getPassword()));
        user.setUsername(userDTO.getUsername());
        user.setAuthProvider(userDTO.getAuthProvider());
        user.setRole(Role.MEMBER);
        user.setEmailVerificationKey(UUID.randomUUID().toString());
        user.setEmailVerified(false);
        return userDAO.create(user);
    }

    @Override
    public UserDTO get(Integer id) {
        User user = userDAO.get(id);
        UserDTO userDTO = new UserDTO();
        userDTO.setId(user.getId());
        userDTO.setName(user.getName());
        userDTO.setEmail(user.getEmail());
        return userDTO;
    }

    @Override
    public List<UserDTO> getAll() {
        List<User> users = userDAO.getAll();
        if (users == null) {
            return null;
        }
        return users.stream().map(user -> {
            UserDTO userDTO = new UserDTO();
            userDTO.setId(user.getId());
            userDTO.setName(user.getName());
            userDTO.setEmail(user.getEmail());
            return userDTO;
        }).collect(Collectors.toList());
    }

    @Override
    public void update(UserDTO userDTO) {
        User user = userDAO.get(userDTO.getId());
        user.setName(userDTO.getName());
        userDAO.update(user);
    }

    @Override
    public void delete(Integer id) {
        User user = userDAO.get(id);
        userDAO.delete(user);
    }

    @Override
    public boolean existsByEmail(String email) {
        User user = userDAO.getByEmail(email);
        return user != null;
    }

    @Override
    public boolean existsByUsername(String username) {
        User user = userDAO.getByUsername(username);
        return user != null;
    }

    @Override
    public UserDTO getByVerificationKey(String key) {
        User user = userDAO.getByVerificationKey(key);
        if (user != null) {
            UserDTO userDTO = new UserDTO();
            userDTO.setId(user.getId());
            userDTO.setName(user.getName());
            userDTO.setEmail(user.getEmail());
            return userDTO;
        }
        return null;
    }
}
