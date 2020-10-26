package com.nyat.raku.security;

import com.nyat.raku.dao.UserDAO;
import com.nyat.raku.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service(value = "SecutiryUserDetailsService")
@Transactional(readOnly = true)
public class SecurityUserDetailsService implements UserDetailsService {

    @Autowired
    private UserDAO userDAO;

    public SecurityUserDetailsService() {
    }

    @Override
    public UserPrincipal loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userDAO.getByUsername(username);
        if (user != null) {
            return UserPrincipal.createInstance(user);
        } else {
            throw new UsernameNotFoundException("User not found");
        }
    }

    public UserPrincipal loadUserByEmail(String email) {
        User user = userDAO.getByEmail(email);
        if (user != null) {
            return UserPrincipal.createInstance(user);
        } else {
            throw new UsernameNotFoundException("User not found");
        }
    }

    public UserPrincipal loadUserById(Integer id) {
        User user = userDAO.get(id);
        if (user != null) {
            return UserPrincipal.createInstance(user);
        } else {
            throw new UsernameNotFoundException("User not found");
        }
    }
}
