package com.nyat.raku.controller;

import com.nyat.raku.util.MultipartFileSender;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;

@Controller
public class MediaController {

    @Value("${music-path}")
    private String MUSIC_PATH;

    @Value("${img-path}")
    private String IMAGE_PATH;

    @GetMapping(value = "/audio/{song-code:.+}")
    @ResponseBody
    public void loadSong(HttpServletRequest request, HttpServletResponse response, @PathVariable("song-code") String songCode) {
        try {
            MultipartFileSender.fromPath(new File(MUSIC_PATH + File.separator + songCode).toPath())
                    .with(request)
                    .with(response)
                    .serveResource();
        } catch (Exception e) {
            System.out.println(e);
        }
    }

    @RequestMapping(value = "/image/{file:.+}", produces = MediaType.IMAGE_JPEG_VALUE)
    @ResponseBody
    public byte[] loadImage(@PathVariable(value = "file") String fileName) {
        String filePath = IMAGE_PATH + File.separator + fileName;
        File file = new File(filePath);
        if (!file.exists()) {
            file = new File(IMAGE_PATH + File.separator + "artist.jpg");
        }
        try {
            return Files.readAllBytes(file.toPath());
        } catch (IOException ignored) {
        }
        return new byte[0];
    }
}
