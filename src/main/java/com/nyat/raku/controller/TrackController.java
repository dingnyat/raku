package com.nyat.raku.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.nyat.raku.model.TrackDTO;
import com.nyat.raku.payload.ApiResponse;
import com.nyat.raku.service.TrackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;

@Controller
@RequestMapping("/api/track")
public class TrackController {

    @Autowired
    private TrackService trackService;

    @PostMapping("/upload")
    @ResponseBody
    public ApiResponse<String> upload(@ModelAttribute TrackDTO track) {
        try {
            trackService.create(track);
            return new ApiResponse<>(true, "ok");
        } catch (Exception e) {
            e.printStackTrace();
            return new ApiResponse<>(false, "not ok");
        }
    }

}
