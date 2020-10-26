package com.nyat.raku;

import com.nyat.raku.security.oauth2.AppProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.EnableAspectJAutoProxy;

@SpringBootApplication
@EnableConfigurationProperties({AppProperties.class})
@EnableAspectJAutoProxy
public class RakuApplication {

    public static void main(String[] args) {
        SpringApplication.run(RakuApplication.class, args);
    }

}
