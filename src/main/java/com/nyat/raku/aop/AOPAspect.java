package com.nyat.raku.aop;

import com.nyat.raku.entity.User;
import com.nyat.raku.security.AdvancedSecurityContextHolder;
import com.nyat.raku.security.UserPrincipal;
import com.nyat.raku.service.EmailService;
import com.nyat.raku.service.UserService;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@Aspect
@Configuration
public class AOPAspect {

    @Autowired
    private EmailService emailService;

    @Autowired
    private UserService userService;

    private ExecutorService executorService = Executors.newFixedThreadPool(1000000);

    // * trong create(*) mang nghĩa thực thi toàn bộ các kế impl method
    @AfterReturning(value = "execution(* com.nyat.raku.service.UserService.create(*))", returning = "user")
    public void sendVerificationEmailAfterRegistering(JoinPoint joinPoint, User user) {
        executorService.submit(() -> {
            emailService.sendVerificationEmail(user);
        });
    }

    @Before("execution(* com.nyat.raku.controller.BaseController.loadSong(..))")
    public void before(JoinPoint joinPoint) {
        String code = joinPoint.getArgs()[2].toString();
        String username = joinPoint.getArgs()[3].toString();
        UserPrincipal userPrincipal = AdvancedSecurityContextHolder.getUserPrincipal();
        if (userPrincipal != null) {
            userService.setHistory(username, code, userPrincipal.getUsername());
        }
    }
}
