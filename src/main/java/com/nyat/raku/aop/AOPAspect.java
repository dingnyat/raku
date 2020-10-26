package com.nyat.raku.aop;

import com.nyat.raku.entity.User;
import com.nyat.raku.service.EmailService;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@Aspect
@Configuration
public class AOPAspect {

    @Autowired
    private EmailService emailService;

    private ExecutorService executorService = Executors.newFixedThreadPool(1000000);

    // * trong create(*) mang nghĩa thực thi toàn bộ các kế impl method
    @AfterReturning(value = "execution(* com.nyat.raku.service.UserService.create(*))", returning = "user")
    public void sendVerificationEmailAfterRegistering(JoinPoint joinPoint, User user) {
        executorService.submit(() -> {
            emailService.sendVerificationEmail(user);
        });
    }

}
