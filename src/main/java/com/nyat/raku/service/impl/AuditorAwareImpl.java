package com.nyat.raku.service.impl;

import com.nyat.raku.dao.UserDAO;
import com.nyat.raku.entity.User;
import com.nyat.raku.security.AdvancedSecurityContextHolder;
import com.nyat.raku.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.AuditorAware;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component(value = "auditorAware")
public class AuditorAwareImpl implements AuditorAware<User> {

    @Autowired
    private UserDAO userDAO;

    @Override
    public Optional<User> getCurrentAuditor() {
        UserPrincipal userPrincipal = AdvancedSecurityContextHolder.getUserPrincipal();
        if (userPrincipal != null) {
            User user = userDAO.getByUsername(userPrincipal.getUsername());
            return Optional.of(user);
        }
        return Optional.empty();
    }
}
