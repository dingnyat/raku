package com.nyat.raku.controller;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.nyat.raku.model.GenreDTO;
import com.nyat.raku.model.PlaylistDTO;
import com.nyat.raku.model.TrackDTO;
import com.nyat.raku.payload.ApiResponse;
import com.nyat.raku.payload.TrackFormData;
import com.nyat.raku.payload.TrackStats;
import com.nyat.raku.payload.UserTrackInfo;
import com.nyat.raku.security.AdvancedSecurityContextHolder;
import com.nyat.raku.security.UserPrincipal;
import com.nyat.raku.service.TrackService;
import com.nyat.raku.util.CropData;
import com.nyat.raku.util.Privacy;
import org.imgscalr.Scalr;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.File;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@Controller
@RequestMapping("/api/track")
public class TrackController {

    @Autowired
    private TrackService trackService;

    @Value("${raku.root-path}")
    private String ROOT_PATH;

    @PostMapping("/upload-audio")
    @ResponseBody
    public ApiResponse<String> uploadAudio(@RequestParam("file") MultipartFile audio) {
        try {
            UserPrincipal userPrincipal = AdvancedSecurityContextHolder.getUserPrincipal();
            String tempFileName = UUID.randomUUID().toString() + "." + Optional.ofNullable(audio.getOriginalFilename()).filter(f -> f.contains(".")).map(f -> f.substring(audio.getOriginalFilename().lastIndexOf(".") + 1)).get();
            String pathToSave = this.ROOT_PATH + File.separator + "user" + File.separator + userPrincipal.getUsername() + File.separator + "audio";
            File dir = new File(pathToSave);
            if (!dir.exists()) {
                dir.mkdirs();
            }
            Files.copy(audio.getInputStream(), Paths.get(pathToSave).resolve(tempFileName), StandardCopyOption.REPLACE_EXISTING);
            return new ApiResponse<>(true, tempFileName);
        } catch (Exception e) {
            e.printStackTrace();
            return new ApiResponse<>(false, "Could not upload the file: " + audio.getOriginalFilename() + "!");
        }
    }

    @PostMapping("/create")
    @ResponseBody
    @Transactional
    public ApiResponse<TrackDTO> create(@ModelAttribute TrackFormData formData) {
        try {
            TrackDTO trackDTO = new TrackDTO();
            trackDTO.setTitle(formData.getTitle());
            trackDTO.setCode(formData.getCode());
            trackDTO.setComposer(formData.getComposer());
            trackDTO.setArtist(formData.getArtist());
            trackDTO.setDescription(formData.getDescription());
            trackDTO.setPlays(0);
            trackDTO.setPrivacy(formData.getPrivacy().equalsIgnoreCase("public") ? Privacy._PUBLIC : Privacy._PRIVATE);
            trackDTO.setDuration(formData.getDuration());
            trackDTO.setExt("." + Optional.ofNullable(formData.getTempAudioName()).filter(f -> f.contains(".")).map(f -> f.substring(formData.getTempAudioName().lastIndexOf(".") + 1)).get());
            trackDTO.setGenres((new ObjectMapper()).readValue(formData.getGenres(), new TypeReference<Set<GenreDTO>>() {
            }));
            trackDTO.setTags((new ObjectMapper()).readValue(formData.getTags(), new TypeReference<Set<String>>() {
            }));

            UserPrincipal userPrincipal = AdvancedSecurityContextHolder.getUserPrincipal();
            File tempAudio = new File(this.ROOT_PATH + File.separator + "user" + File.separator + userPrincipal.getUsername() + File.separator + "audio" + File.separator + formData.getTempAudioName());
            File finalAudio = new File(this.ROOT_PATH + File.separator + "user" + File.separator + userPrincipal.getUsername() + File.separator + "audio" + File.separator + formData.getCode() + "." + Optional.ofNullable(formData.getTempAudioName()).filter(f -> f.contains(".")).map(f -> f.substring(formData.getTempAudioName().lastIndexOf(".") + 1)).get());
            tempAudio.renameTo(finalAudio);
            if (formData.getImage() != null) {
                CropData cropData = (new ObjectMapper()).readValue(formData.getCropData(), CropData.class);
                BufferedImage originalImg = ImageIO.read(formData.getImage().getInputStream());
                BufferedImage scaledImg = Scalr.resize(originalImg,
                        Scalr.Method.SPEED,
                        Scalr.Mode.AUTOMATIC,
                        (int) (originalImg.getWidth() * cropData.getScale()),
                        (int) (originalImg.getHeight() * cropData.getScale()));

                BufferedImage resultImg = scaledImg.getSubimage(cropData.getX(), cropData.getY(), cropData.getW(), cropData.getH());
                File dir = new File(this.ROOT_PATH + File.separator + "user" + File.separator + userPrincipal.getUsername() + File.separator + "image");
                if (!dir.exists()) dir.mkdirs();
                File imgFile = new File(this.ROOT_PATH + File.separator + "user" + File.separator + userPrincipal.getUsername() + File.separator + "image" + File.separator + formData.getCode() + ".jpg");
                ImageIO.write(resultImg, "jpg", imgFile);
                trackDTO.setImageUrl(formData.getCode() + ".jpg");
            }

            trackService.create(trackDTO);
            return new ApiResponse<>(true, trackDTO);
        } catch (Exception e) {
            e.printStackTrace();
            return new ApiResponse<>(false, null);
        }
    }

    @PostMapping("/update")
    @ResponseBody
    @Transactional
    public ApiResponse<TrackDTO> update(@ModelAttribute TrackFormData formData) {
        try {
            TrackDTO trackDTO = new TrackDTO();
            trackDTO.setId(formData.getId());
            trackDTO.setTitle(formData.getTitle());
            trackDTO.setCode(formData.getCode());
            trackDTO.setComposer(formData.getComposer());
            trackDTO.setArtist(formData.getArtist());
            trackDTO.setDescription(formData.getDescription());
            trackDTO.setPrivacy(formData.getPrivacy().equalsIgnoreCase("public") ? Privacy._PUBLIC : Privacy._PRIVATE);
            trackDTO.setGenres((new ObjectMapper()).readValue(formData.getGenres(), new TypeReference<Set<GenreDTO>>() {
            }));
            trackDTO.setTags((new ObjectMapper()).readValue(formData.getTags(), new TypeReference<Set<String>>() {
            }));

            UserPrincipal userPrincipal = AdvancedSecurityContextHolder.getUserPrincipal();
            if (formData.getImage() != null) {
                System.out.println(formData.getImage().getOriginalFilename());
                CropData cropData = (new ObjectMapper()).readValue(formData.getCropData(), CropData.class);
                BufferedImage originalImg = ImageIO.read(formData.getImage().getInputStream());
                BufferedImage scaledImg = Scalr.resize(originalImg,
                        Scalr.Method.SPEED,
                        Scalr.Mode.AUTOMATIC,
                        (int) (originalImg.getWidth() * cropData.getScale()),
                        (int) (originalImg.getHeight() * cropData.getScale()));

                BufferedImage resultImg = scaledImg.getSubimage(cropData.getX(), cropData.getY(), cropData.getW(), cropData.getH());
                File dir = new File(this.ROOT_PATH + File.separator + "user" + File.separator + userPrincipal.getUsername() + File.separator + "image");
                if (!dir.exists()) dir.mkdirs();
                File imgFile = new File(this.ROOT_PATH + File.separator + "user" + File.separator + userPrincipal.getUsername() + File.separator + "image" + File.separator + formData.getCode() + ".jpg");
                ImageIO.write(resultImg, "jpg", imgFile);
                trackDTO.setImageUrl(formData.getCode() + ".jpg");
            }

            trackService.update(trackDTO);
            return new ApiResponse<>(true, trackDTO);
        } catch (Exception e) {
            e.printStackTrace();
            return new ApiResponse<>(false, null);
        }
    }


    @GetMapping("/get")
    @ResponseBody
    public ApiResponse<TrackDTO> get(@RequestParam("username") String username, @RequestParam("code") String code) {
        try {
            // check bảo mật cho bài hát private
            TrackDTO trackDTO = trackService.getByCode(username, code);
            return new ApiResponse<>(true, trackDTO);
        } catch (Exception e) {
            e.printStackTrace();
            return new ApiResponse<>(false, null);
        }
    }

    @GetMapping("/delete/{trackId}")
    @ResponseBody
    public ApiResponse<?> delete(@PathVariable("trackId") Integer trackId) {
        try {
            trackService.delete(trackId);
            return new ApiResponse<>(true, null);
        } catch (Exception e) {
            e.printStackTrace();
            return new ApiResponse<>(false, null);
        }
    }

    @GetMapping("/user-track-info")
    @ResponseBody
    public ApiResponse<UserTrackInfo> getUserTrackInfo(@RequestParam("username") String username, @RequestParam("code") String code) {
        try {
            UserPrincipal userPrincipal = AdvancedSecurityContextHolder.getUserPrincipal();
            UserTrackInfo userTrackInfo = trackService.getUserTrackInfo(username, code, userPrincipal.getUsername());
            return new ApiResponse<>(true, userTrackInfo);
        } catch (Exception e) {
            System.out.println(e);
            return new ApiResponse<>(false, null);
        }
    }

    @GetMapping("/get-track-stats")
    @ResponseBody
    public ApiResponse<TrackStats> getTrackStats(@RequestParam("username") String username, @RequestParam("code") String code) {
        try {
            TrackStats trackStats = trackService.getTrackStats(username, code);
            return new ApiResponse<>(true, trackStats);
        } catch (Exception e) {
            e.printStackTrace();
            return new ApiResponse<>(false, null);
        }
    }

    @GetMapping("/get-tracks/{username}")
    @ResponseBody
    public ApiResponse<List<TrackDTO>> getTracksOf(@PathVariable("username") String username) {
        try {
            List<TrackDTO> tracks = trackService.getTracksOf(username);
            return new ApiResponse<>(true, tracks);
        } catch (Exception e) {
            e.printStackTrace();
            return new ApiResponse<>(false, null);
        }
    }

    @GetMapping("/get-repost-tracks/{username}")
    @ResponseBody
    public ApiResponse<List<TrackDTO>> getRepostTracksOf(@PathVariable("username") String username) {
        try {
            List<TrackDTO> tracks = trackService.getRepostTracksOf(username);
            return new ApiResponse<>(true, tracks);
        } catch (Exception e) {
            e.printStackTrace();
            return new ApiResponse<>(false, null);
        }
    }

    @GetMapping("/get-playlists/{username}")
    @ResponseBody
    public ApiResponse<List<PlaylistDTO>> getPlaylistsOf(@PathVariable("username") String username) {
        try {
            List<PlaylistDTO> playlists = trackService.getPlaylistsOf(username);
            return new ApiResponse<>(true, playlists);
        } catch (Exception e) {
            e.printStackTrace();
            return new ApiResponse<>(false, null);
        }
    }
}