package com.nyat.raku.controller;

import com.nyat.raku.model.PlaylistDTO;
import com.nyat.raku.payload.ApiResponse;
import com.nyat.raku.payload.PlaylistForm;
import com.nyat.raku.service.PlaylistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/api/playlist")
public class PlaylistController {

    @Autowired
    private PlaylistService playlistService;

    @GetMapping("")
    @ResponseBody
    public ApiResponse<?> find(@RequestParam("username") String username, @RequestParam("code") String code) {
        try {
            return new ApiResponse<>(true, playlistService.getByCode(username, code));
        } catch (Exception e) {
            e.printStackTrace();
            return new ApiResponse<>(false, "Could not create playlist!");
        }
    }

    @PostMapping("/create")
    @ResponseBody
    public ApiResponse<?> create(@ModelAttribute PlaylistForm playlistForm) {
        try {
            playlistService.create(playlistForm);
            return new ApiResponse<>(true, "Created playlist successfully!");
        } catch (Exception e) {
            e.printStackTrace();
            return new ApiResponse<>(false, "Could not create playlist!");
        }
    }

    @PutMapping("/update")
    @ResponseBody
    public ApiResponse<?> update(@ModelAttribute PlaylistForm playlistForm) {
        try {
            playlistService.update(playlistForm);
            return new ApiResponse<>(true, "Updated playlist successfully!");
        } catch (Exception e) {
            e.printStackTrace();
            return new ApiResponse<>(false, "Could not update playlist!");
        }
    }

    @DeleteMapping("/delete/{id}")
    @ResponseBody
    public ApiResponse<?> delete(@PathVariable("id") Integer id) {
        try {
            playlistService.delete(id);
            return new ApiResponse<>(true, "Deleted playlist successfully!");
        } catch (Exception e) {
            e.printStackTrace();
            return new ApiResponse<>(false, "Could not delete playlist!");
        }
    }
}
