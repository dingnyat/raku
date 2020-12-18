package com.nyat.raku.controller;

import com.nyat.raku.exception.BadRequestException;
import com.nyat.raku.model.UserDTO;
import com.nyat.raku.payload.*;
import com.nyat.raku.security.AdvancedSecurityContextHolder;
import com.nyat.raku.security.AuthProvider;
import com.nyat.raku.security.TokenProvider;
import com.nyat.raku.security.UserPrincipal;
import com.nyat.raku.security.oauth2.HttpCookieOAuth2AuthorizationRequestRepository;
import com.nyat.raku.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
public class AuthController {

    @Autowired
    private TokenProvider tokenProvider;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    HttpCookieOAuth2AuthorizationRequestRepository httpCookieOAuth2AuthorizationRequestRepository;

    @Autowired
    private UserService userService;

    @PostMapping("/auth/login")
    public ApiResponse<AuthTokenResponse> login(@Valid @RequestBody LoginReq loginReq) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginReq.getUsername(),
                        loginReq.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        AuthTokenResponse tokenResponse = tokenProvider.createToken(authentication);
        return new ApiResponse<>(true, tokenResponse);
    }

    @PostMapping("/auth/check-email")
    public ApiResponse<String> checkEmail(@Valid @RequestBody String email) {
        return new ApiResponse<>(true, Boolean.toString(userService.existsByEmail(email)));
    }

    @GetMapping("/auth/logout")
    public ApiResponse<String> logout() {
        // TODO Làm gì đó đề thu hồi token của nó lại. Nếu không sẽ có lỗi về bảo mật nghiêm trọng
        return new ApiResponse<>(true, "Logout");
    }

    @GetMapping("/auth/get-me")
    public ApiResponse<AuthUserInfo> getAuthenticatedUserInfo() {
        UserPrincipal userPrincipal = AdvancedSecurityContextHolder.getUserPrincipal();
        AuthUserInfo userInfo = new AuthUserInfo();
        userInfo.setName(userPrincipal.getName());
        userInfo.setUsername(userPrincipal.getUsername());
        userInfo.setImageUrl(userPrincipal.getImageUrl());
        userInfo.setRole("member");
        return new ApiResponse<>(true, userInfo);
    }

    @PostMapping("/auth/signup")
    public ApiResponse<String> registerUser(@Valid @RequestBody SignUpReq signUpReq) {
        if (userService.existsByEmail(signUpReq.getEmail())) {
            throw new BadRequestException("Email address already in use.");
        }
        UserDTO user = new UserDTO();
        user.setUsername(signUpReq.getUsername());
        user.setPassword(signUpReq.getPassword());
        user.setName(signUpReq.getName());
        user.setEmail(signUpReq.getEmail());
        user.setAuthProvider(AuthProvider.local);
        userService.create(user);
        return new ApiResponse<>(true, "User registered successfully!");
    }

    @GetMapping("/auth/email-verify")
    public ApiResponse<String> verify(@RequestParam("key") String key) {
        UserDTO userDTO = userService.getByVerificationKey(key);
        if (userDTO == null) {
            return new ApiResponse<>(false, "Can't find the account!");
        } else {
            userService.verifyAccount(userDTO.getId());
            return new ApiResponse<>(true, "Account is verified successfully!");
        }
    }

    @PostMapping("/auth/reset-password")
    public ApiResponse<String> resetPassword(@RequestBody ResetPassword resetPassword) {
        if (!userService.resetPassword(resetPassword)) {
            return new ApiResponse<>(false, "Can't find the account!");
        } else {
            return new ApiResponse<>(true, "Account is reset password successfully!");
        }
    }

    @GetMapping("/auth/send-reset-password-email")
    public ApiResponse<String> sendResetPasswordEmail(@RequestParam("email") String email) {
        try {
            userService.generatePasswordResetTokenWithEmail(email);
            return new ApiResponse<>(true, "An email has sent to your email. Please check it!");
        } catch (Exception e) {
            return new ApiResponse<>(false, "Error!");
        }
    }
}
