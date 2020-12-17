package com.nyat.raku.service;

import com.nyat.raku.entity.User;

public interface EmailService {
    void sendVerificationEmail(User user);

    void sendPasswordResetEmail(User user);
}
