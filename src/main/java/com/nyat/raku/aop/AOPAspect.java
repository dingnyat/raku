package com.nyat.raku.aop;

import com.nyat.raku.entity.User;
import com.nyat.raku.security.AdvancedSecurityContextHolder;
import com.nyat.raku.security.UserPrincipal;
import com.nyat.raku.service.EmailService;
import com.nyat.raku.service.TrackService;
import com.nyat.raku.service.UserService;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@Aspect
@Configuration
public class AOPAspect {

    @Autowired
    private EmailService emailService;

    @Autowired
    private UserService userService;

    @Autowired
    private TrackService trackService;

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

        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes()).getRequest();
        String startByte = request.getHeader("Range").substring(6, request.getHeader("Range").indexOf("-"));

        if (startByte.equals("0")) {
            System.out.println("Count: " + code);
            trackService.countPlay(username, code);
        }

        UserPrincipal userPrincipal = AdvancedSecurityContextHolder.getUserPrincipal();
        if (userPrincipal != null) {
            userService.setHistory(username, code, userPrincipal.getUsername());
        }
    }
}
