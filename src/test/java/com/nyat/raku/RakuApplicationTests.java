package com.nyat.raku;

import com.nyat.raku.entity.User;
import com.nyat.raku.service.EmailService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class RakuApplicationTests {

    @Autowired
    EmailService emailService;

    @Test
    void contextLoads() {
    }


    @Test
    public void test(){
        User user = new User();
        user.setEmail("nhatkakaka@gmail.com");
        user.setName("Dou");
        user.setEmailVerificationKey("djlksajdlkasjdlkajds");
        emailService.sendVerificationEmail(user);
    }
}
