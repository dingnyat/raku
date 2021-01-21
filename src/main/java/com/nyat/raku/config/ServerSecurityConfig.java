package com.nyat.raku.config;

import com.nyat.raku.security.AdvancedSecurityContextHolder;
import com.nyat.raku.security.RestAuthenticationEntryPoint;
import com.nyat.raku.security.SecurityUserDetailsService;
import com.nyat.raku.security.TokenAuthenticationFilter;
import com.nyat.raku.security.oauth2.HttpCookieOAuth2AuthorizationRequestRepository;
import com.nyat.raku.security.oauth2.OAuth2AuthenticationFailureHandler;
import com.nyat.raku.security.oauth2.OAuth2AuthenticationSuccessHandler;
import com.nyat.raku.security.oauth2.Oauth2UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.BeanIds;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(
        securedEnabled = true,
        jsr250Enabled = true,
        prePostEnabled = true)
public class ServerSecurityConfig extends WebSecurityConfigurerAdapter {

    @Autowired
    private SecurityUserDetailsService userDetailsService;

    @Autowired
    private Oauth2UserService oauth2UserService;

    @Autowired
    private OAuth2AuthenticationFailureHandler oAuth2AuthenticationFailureHandler;

    @Autowired
    private OAuth2AuthenticationSuccessHandler oAuth2AuthenticationSuccessHandler;

    @Bean
    public PasswordEncoder userPasswordEncoder() {
        return new BCryptPasswordEncoder(8);
    }

    @Bean
    public TokenAuthenticationFilter tokenAuthenticationFilter() {
        return new TokenAuthenticationFilter();
    }

    /*
      By default, Spring OAuth2 uses HttpSessionOAuth2AuthorizationRequestRepository to save
      the authorization request. But, since our service is stateless, we can't save it in
      the session. We'll save the request in a Base64 encoded cookie instead.
    */
    @Bean
    public HttpCookieOAuth2AuthorizationRequestRepository cookieAuthorizationRequestRepository() {
        return new HttpCookieOAuth2AuthorizationRequestRepository();
    }

    @Bean(BeanIds.AUTHENTICATION_MANAGER)
    @Override
    public AuthenticationManager authenticationManagerBean() throws Exception {
        AdvancedSecurityContextHolder.setAuthenticationManager(super.authenticationManagerBean());
        AdvancedSecurityContextHolder.setUserDetailsService(this.userDetailsService);
        return super.authenticationManagerBean();
    }

    @Autowired
    public void globalUserDetails(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(userDetailsService)
                .passwordEncoder(this.userPasswordEncoder());
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.csrf().disable();
        http.cors();
        http.formLogin().disable();
        http.httpBasic().disable();
        http.exceptionHandling().authenticationEntryPoint(new RestAuthenticationEntryPoint()); // thử xóa đi
        http.authorizeRequests()
                .antMatchers("/auth/**", "/oauth/**", "/oauth2/**",
                        "/swagger-ui.html", "/webjars/**", "/swagger-resources/**", "/v2/api-docs/**",
                        "/**/audio/**",
                        "/**/audio-download/**",
                        "/**/image/**",
                        "/avatar/**",
                        "/search",
                        "/api/webhook/transfer",
                        "/get-qr-code-image/*",
                        "/api/**").permitAll()
                .anyRequest().authenticated();
        http.oauth2Login()
                .authorizationEndpoint().baseUri("/oauth2/authorize")
                .authorizationRequestRepository(cookieAuthorizationRequestRepository())
                .and()
                .redirectionEndpoint().baseUri("/oauth2/callback/*")
                .and().userInfoEndpoint().userService(oauth2UserService)
                .and().successHandler(oAuth2AuthenticationSuccessHandler).failureHandler(oAuth2AuthenticationFailureHandler);
        // Add our custom Token based authentication filter
        http.addFilterBefore(tokenAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);
    }
}
