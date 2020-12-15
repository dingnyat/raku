package com.nyat.raku.controller;

import com.nyat.raku.model.TrackDTO;
import com.nyat.raku.service.TrackService;
import com.nyat.raku.util.MultipartFileSender;
import org.springframework.beans.factory.annotation.Autowired;
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

    @Value("${raku.root-path}")
    private String ROOT_PATH;

    @Autowired
    private TrackService trackService;

    @GetMapping(value = "/{username}/audio/{song-code}")
    @ResponseBody
    public void loadSong(HttpServletRequest request, HttpServletResponse response,
                         @PathVariable("song-code") String songCode, @PathVariable("username") String username) {
        try {
            TrackDTO track = trackService.getByCode(username, songCode);
            String path = this.ROOT_PATH + File.separator + "user" + File.separator + username + File.separator + "audio" + File.separator + songCode + track.getExt();
            MultipartFileSender.fromPath(new File(path).toPath())
                    .with(request)
                    .with(response)
                    .serveResource();
        } catch (Exception e) {
            System.out.println(e.toString());
        }
    }

    @GetMapping(value = "/{username}/audio-download/{song-code}", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    @ResponseBody
    public byte[] downloadAudio(@PathVariable("song-code") String songCode, @PathVariable("username") String username, HttpServletResponse resp) {
        try {
            TrackDTO track = trackService.getByCode(username, songCode);
            String path = this.ROOT_PATH + File.separator + "user" + File.separator + username + File.separator + "audio" + File.separator + songCode + track.getExt();
            File file = new File(path);
            if (!file.exists()) {
                return new byte[0];
            }
            resp.setHeader("Content-Disposition", "attachment; filename=\"" + track.getCode() + track.getExt() + "\"");
            return Files.readAllBytes(file.toPath());
        } catch (Exception e) {
            System.out.println(e);
        }
        return new byte[0];
    }

    @RequestMapping(value = "/{username}/image/{file:.+}", produces = MediaType.IMAGE_JPEG_VALUE)
    @ResponseBody
    public byte[] loadImage(@PathVariable("username") String username, @PathVariable(value = "file") String fileName) {
        String filePath = this.ROOT_PATH + File.separator + "user" + File.separator + username + File.separator + "image" + File.separator + fileName;
        File file = new File(filePath);
        if (!file.exists()) {
            return new byte[0];
        }
        try {
            return Files.readAllBytes(file.toPath());
        } catch (IOException ignored) {
        }
        return new byte[0];
    }

    @RequestMapping(value = "/avatar/{username}", produces = MediaType.IMAGE_JPEG_VALUE)
    @ResponseBody
    public byte[] loadAvatar(@PathVariable("username") String username) {
        String filePath = this.ROOT_PATH + File.separator + "user" + File.separator + username + File.separator + "avatar.jpg";
        File file = new File(filePath);
        if (!file.exists()) {
            return new byte[0];
        }
        try {
            return Files.readAllBytes(file.toPath());
        } catch (IOException ignored) {
        }
        return new byte[0];
    }
}