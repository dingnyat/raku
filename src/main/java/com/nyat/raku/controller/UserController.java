package com.nyat.raku.controller;

import com.nyat.raku.model.UserDTO;
import com.nyat.raku.payload.ApiResponse;
import com.nyat.raku.security.AdvancedSecurityContextHolder;
import com.nyat.raku.security.UserPrincipal;
import com.nyat.raku.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/{username}")
    @ResponseBody
    public ApiResponse<UserDTO> get(@PathVariable("username") String username) {
        try {
            UserDTO user = userService.getByUsername(username);
            return new ApiResponse<>(true, user);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new ApiResponse<>(false, null);
    }

    @GetMapping("/like-track")
    @ResponseBody
    public ApiResponse likeTrack(@RequestParam("track") Integer trackId) {
        try {
            UserPrincipal userPrincipal = AdvancedSecurityContextHolder.getUserPrincipal();
            userService.likeTrack(trackId, userPrincipal.getUsername());
            return new ApiResponse<>(true, null);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new ApiResponse<>(false, null);
    }
}
