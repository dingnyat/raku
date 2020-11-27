package com.nyat.raku.security;

import org.springframework.lang.Nullable;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;

import java.util.List;
import java.util.stream.Collectors;

public class AdvancedSecurityContextHolder {

    private static AuthenticationManager authenticationManager;

    private static UserDetailsService userDetailsService;

    public static boolean isLoggedIn() {
        return !(SecurityContextHolder.getContext().getAuthentication() instanceof AnonymousAuthenticationToken) && SecurityContextHolder.getContext().getAuthentication().isAuthenticated();
    }

    public static UsernamePasswordAuthenticationToken manuallyLogIn(String username, String password) {
        UserPrincipal userPrincipal = (UserPrincipal) userDetailsService.loadUserByUsername(username);

        UsernamePasswordAuthenticationToken authenticationToken
                = new UsernamePasswordAuthenticationToken(userPrincipal, password, userPrincipal.getAuthorities());

        authenticationManager.authenticate(authenticationToken);

        if (authenticationToken.isAuthenticated()) {
            SecurityContextHolder.getContext().setAuthentication(authenticationToken);
            return authenticationToken;
        }
        return null;
    }

    public static List<String> getRolesOfAuthenticatedUser() {
        return SecurityContextHolder.getContext().getAuthentication().getAuthorities().stream().map(GrantedAuthority::getAuthority).collect(Collectors.toList());
    }

    public static boolean hasAnyRoles(String... roles) {
        for (GrantedAuthority authority : SecurityContextHolder.getContext().getAuthentication().getAuthorities()) {
            for (String role : roles) {
                if (authority.getAuthority().equals(role)) return true;
            }
        }
        return false;
    }

    public static boolean checkRolePolicy(@Nullable List<String> roles, boolean isRestricted, @Nullable List<String> restrictedRoles) {
        List<String> rolesOfAuthenticatedUser = getRolesOfAuthenticatedUser();

        if (isRestricted && restrictedRoles != null) {
            for (String restrictedRole : restrictedRoles) {
                if (rolesOfAuthenticatedUser.contains(restrictedRole)) return false;
            }
        }

        if (roles != null) {
            for (String role : roles) {
                if (rolesOfAuthenticatedUser.contains(role)) return true;
            }
        }

        return false;
    }

    public static UserPrincipal getUserPrincipal() {
        if (isLoggedIn()) {
            return (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        } else {
            return null;
        }
    }

    public static void setAuthenticationManager(AuthenticationManager authenticationManager) {
        AdvancedSecurityContextHolder.authenticationManager = authenticationManager;
    }

    public static void setUserDetailsService(UserDetailsService userDetailsService) {
        AdvancedSecurityContextHolder.userDetailsService = userDetailsService;
    }
}
