package com.nyat.raku;

import com.nyat.raku.security.oauth2.AppProperties;
import com.nyat.raku.util.paypal.PaypalProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.EnableAspectJAutoProxy;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableConfigurationProperties({AppProperties.class, PaypalProperties.class})
@EnableAspectJAutoProxy
@EnableScheduling
public class RakuApplication {

    public static void main(String[] args) {
        SpringApplication.run(RakuApplication.class, args);
    }
}
