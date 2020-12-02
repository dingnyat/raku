package com.nyat.raku.controller;

import com.nyat.raku.model.CommentDTO;
import com.nyat.raku.model.TrackDTO;
import com.nyat.raku.model.UserDTO;
import com.nyat.raku.payload.ApiResponse;
import com.nyat.raku.payload.CommentPayload;
import com.nyat.raku.payload.UserStats;
import com.nyat.raku.security.AdvancedSecurityContextHolder;
import com.nyat.raku.security.UserPrincipal;
import com.nyat.raku.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    public ApiResponse<?> likeTrack(@RequestParam("track") Integer trackId) {
        try {
            UserPrincipal userPrincipal = AdvancedSecurityContextHolder.getUserPrincipal();
            userService.likeTrack(trackId, userPrincipal.getUsername());
            return new ApiResponse<>(true, null);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new ApiResponse<>(false, null);
    }

    @GetMapping("/repost-track")
    @ResponseBody
    public ApiResponse<?> repostTrack(@RequestParam("track") Integer trackId) {
        try {
            UserPrincipal userPrincipal = AdvancedSecurityContextHolder.getUserPrincipal();
            userService.repostTrack(trackId, userPrincipal.getUsername());
            return new ApiResponse<>(true, null);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new ApiResponse<>(false, null);
    }

    @GetMapping("/follow-user")
    @ResponseBody
    public ApiResponse<?> followUser(@RequestParam("username") String username) {
        try {
            UserPrincipal userPrincipal = AdvancedSecurityContextHolder.getUserPrincipal();
            userService.followUser(username, userPrincipal.getUsername());
            return new ApiResponse<>(true, null);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new ApiResponse<>(false, null);
    }

    @PostMapping("/comment")
    @ResponseBody
    public ApiResponse<CommentDTO> comment(@RequestBody CommentPayload commentPayload) {
        try {
            CommentDTO commentDTO = userService.comment(commentPayload);
            return new ApiResponse<>(true, commentDTO);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new ApiResponse<>(false, null);
    }

    @GetMapping("/get-user-stats")
    @ResponseBody
    public ApiResponse<UserStats> getUserStats(@RequestParam("username") String username) {
        try {
            UserStats userStats = userService.getUserStats(username);
            return new ApiResponse<>(true, userStats);
        } catch (Exception e) {
            e.printStackTrace();
            return new ApiResponse<>(false, null);
        }
    }

    @GetMapping("/get-history-tracks")
    @ResponseBody
    public ApiResponse<List<TrackDTO>> getHistoryTracks() {
        try {
            UserPrincipal userPrincipal = AdvancedSecurityContextHolder.getUserPrincipal();
            List<TrackDTO> tracks = userService.getHistoryTracks(userPrincipal.getUsername());
            return new ApiResponse<>(true, tracks);
        } catch (Exception e) {
            System.out.println(e);
            return new ApiResponse<>(false, null);
        }
    }

    @GetMapping("/get-your-tracks")
    @ResponseBody
    public ApiResponse<List<TrackDTO>> getYourTracks() {
        try {
            UserPrincipal userPrincipal = AdvancedSecurityContextHolder.getUserPrincipal();
            List<TrackDTO> tracks = userService.getTracks(userPrincipal.getUsername());
            return new ApiResponse<>(true, tracks);
        } catch (Exception e) {
            e.printStackTrace();
            return new ApiResponse<>(false, null);
        }
    }

    @GetMapping("/delete-comment/{cmt-id}")
    @ResponseBody
    public ApiResponse<?> deleteComment(@PathVariable("cmt-id") Integer cmtId) {
        try {
            userService.deleteComment(cmtId);
            return new ApiResponse<>(true, null);
        } catch (Exception e) {
            e.printStackTrace();
            return new ApiResponse<>(false, null);
        }
    }

}
