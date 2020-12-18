package com.nyat.raku.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.nyat.raku.dao.CommentDAO;
import com.nyat.raku.dao.TrackDAO;
import com.nyat.raku.dao.UserDAO;
import com.nyat.raku.entity.*;
import com.nyat.raku.model.*;
import com.nyat.raku.payload.CommentPayload;
import com.nyat.raku.payload.ResetPassword;
import com.nyat.raku.payload.UserFormData;
import com.nyat.raku.payload.UserStats;
import com.nyat.raku.security.AdvancedSecurityContextHolder;
import com.nyat.raku.security.Role;
import com.nyat.raku.security.UserPrincipal;
import com.nyat.raku.service.EmailService;
import com.nyat.raku.service.UserService;
import com.nyat.raku.util.CropData;
import com.nyat.raku.util.DateTimeUtils;
import org.imgscalr.Scalr;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.util.Date;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class UserServiceImpl implements UserService {
    @Autowired
    private UserDAO userDAO;

    @Autowired
    private TrackDAO trackDAO;

    @Autowired
    private CommentDAO commentDAO;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;

    @Value("${raku.root-path}")
    private String storagePath;

    @Value("${raku.base-url}")
    private String BASE_URL;

    @Override
    public User create(UserDTO userDTO) {
        User user = new User();
        user.setName(userDTO.getName());
        user.setEmail(userDTO.getEmail());
        user.setEncodedPassword(passwordEncoder.encode(userDTO.getPassword()));
        user.setUsername(userDTO.getUsername());
        user.setAuthProvider(userDTO.getAuthProvider());
        user.setRole(Role.MEMBER);
        user.setEmailVerificationKey(UUID.randomUUID().toString());
        user.setEmailVerified(false);
        return userDAO.create(user);
    }

    @Override
    public UserDTO get(Integer id) {
        User user = userDAO.get(id);
        UserDTO userDTO = new UserDTO();
        userDTO.setId(user.getId());
        userDTO.setName(user.getName());
        userDTO.setEmail(user.getEmail());
        return userDTO;
    }

    @Override
    public List<UserDTO> getAll() {
        List<User> users = userDAO.getAll();
        if (users == null) {
            return null;
        }
        return users.stream().map(user -> {
            UserDTO userDTO = new UserDTO();
            userDTO.setId(user.getId());
            userDTO.setName(user.getName());
            userDTO.setEmail(user.getEmail());
            return userDTO;
        }).collect(Collectors.toList());
    }

    @Override
    public void update(UserDTO userDTO) {
        User user = userDAO.get(userDTO.getId());
        user.setName(userDTO.getName());
        userDAO.update(user);
    }

    @Override
    public void delete(Integer id) {
        User user = userDAO.get(id);
        userDAO.delete(user);
    }

    @Override
    public boolean existsByEmail(String email) {
        User user = userDAO.getByEmail(email);
        return user != null;
    }

    @Override
    public boolean existsByUsername(String username) {
        User user = userDAO.getByUsername(username);
        return user != null;
    }

    @Override
    public UserDTO getByVerificationKey(String key) {
        User user = userDAO.getByVerificationKey(key);
        if (user != null) {
            UserDTO userDTO = new UserDTO();
            userDTO.setId(user.getId());
            userDTO.setName(user.getName());
            userDTO.setEmail(user.getEmail());
            return userDTO;
        }
        return null;
    }

    @Override
    public void verifyAccount(Integer id) {
        User user = userDAO.get(id);
        user.setEmailVerified(true);
        userDAO.update(user);
    }

    @Override
    public UserDTO getByUsername(String username) {
        User user = userDAO.getByUsername(username);
        if (user != null) {
            UserDTO userDTO = new UserDTO();
            userDTO.setId(user.getId());
            userDTO.setName(user.getName());
            userDTO.setUsername(user.getUsername());
            userDTO.setImageUrl(user.getImageUrl());
            userDTO.setBio(user.getBio());
            userDTO.setCity(user.getCity());
            userDTO.setCountry(user.getCountry());
            return userDTO;
        }
        return null;
    }

    @Override
    public void likeTrack(Integer trackId, String username) {
        User user = userDAO.getByUsername(username);
        Track track = trackDAO.get(trackId);
        if (user.getLikeTracks().contains(track)) {
            user.getLikeTracks().remove(track);
        } else {
            user.getLikeTracks().add(track);
        }
    }

    @Override
    public void repostTrack(Integer trackId, String username) {
        User user = userDAO.getByUsername(username);
        Track track = trackDAO.get(trackId);
        if (user.getRepostTracks().stream().anyMatch(t -> t.getTrack().getId().equals(track.getId()))) {
            user.getRepostTracks().removeIf(repostTrack -> repostTrack.getTrack().getId().equals(track.getId()));
        } else {
            user.getRepostTracks().add(new RepostTrack(user, track));
        }
    }

    @Override
    public void followUser(String followUser, String actingUser) {
        if (followUser.equals(actingUser)) return;
        User actUser = userDAO.getByUsername(actingUser);
        User follow = userDAO.getByUsername(followUser);
        if (actUser.getFollowingUsers().contains(follow)) {
            actUser.getFollowingUsers().remove(follow);
        } else {
            actUser.getFollowingUsers().add(follow);
        }
    }

    @Override
    public CommentDTO comment(CommentPayload commentPayload) {
        if (commentPayload.getTrackId() != null) {
            Track track = trackDAO.get(commentPayload.getTrackId());
            if (track != null) {
                Comment comment = new Comment();
                comment.setContent(commentPayload.getContent());
                comment.setTrack(track);
                UserPrincipal userPrincipal = AdvancedSecurityContextHolder.getUserPrincipal();
                User user = userDAO.getByUsername(userPrincipal.getUsername());
                comment.setUploader(user);
                comment.setCreatedDate(DateTimeUtils.getCurrentDateTime());
                comment = commentDAO.create(comment);

                CommentDTO commentDTO = new CommentDTO();
                commentDTO.setId(comment.getId());
                commentDTO.setContent(comment.getContent());
                commentDTO.setTime(comment.getCreatedDate());
                UserDTO uploader = new UserDTO();
                uploader.setName(comment.getUploader().getName());
                uploader.setId(comment.getUploader().getId());
                uploader.setUsername(comment.getUploader().getUsername());
                if (comment.getUploader().getImageUrl() != null) {
                    uploader.setImageUrl(comment.getUploader().getImageUrl());
                }
                commentDTO.setUploader(uploader);
                return commentDTO;
            }
        }
        if (commentPayload.getReplyCommentId() != null) {
            Comment comment = commentDAO.get(commentPayload.getReplyCommentId());
            if (comment != null) {
                Comment reply = new Comment();
                reply.setContent(commentPayload.getContent());
                reply.setParent(comment);
                UserPrincipal userPrincipal = AdvancedSecurityContextHolder.getUserPrincipal();
                User user = userDAO.getByUsername(userPrincipal.getUsername());
                reply.setUploader(user);
                reply.setCreatedDate(DateTimeUtils.getCurrentDateTime());
                reply = commentDAO.create(reply);

                CommentDTO commentDTO = new CommentDTO();
                commentDTO.setId(reply.getId());
                commentDTO.setContent(reply.getContent());
                commentDTO.setTime(reply.getCreatedDate());
                UserDTO uploader = new UserDTO();
                uploader.setName(reply.getUploader().getName());
                uploader.setId(reply.getUploader().getId());
                uploader.setUsername(reply.getUploader().getUsername());
                if (reply.getUploader().getImageUrl() != null) {
                    uploader.setImageUrl(reply.getUploader().getImageUrl());
                }
                commentDTO.setUploader(uploader);
                return commentDTO;
            }
        }
        return null;
    }

    @Override
    public UserStats getUserStats(String username) {
        User user = userDAO.getByUsername(username);
        UserStats userStats = new UserStats();
        userStats.setFollowers(user.getFollowers().size());
        userStats.setFollowing(user.getFollowingUsers().size());
        userStats.setTracks(user.getTracks().size());
        UserPrincipal userPrincipal = AdvancedSecurityContextHolder.getUserPrincipal();
        userStats.setYouFollowing(userPrincipal != null && user.getFollowers().stream().anyMatch(u -> u.getUsername().equals(userPrincipal.getUsername())));
        return userStats;
    }

    @Override
    public void setHistory(String uploader, String code, String username) {
        User user = userDAO.getByUsername(username);
        Track track = trackDAO.getByCode(uploader, code);
        if (user.getHistoryTracks().stream().anyMatch(historyTrack -> track.getId().equals(historyTrack.getTrack().getId()))) {
            user.getHistoryTracks().stream().filter(historyTrack -> historyTrack.getTrack().getId().equals(track.getId())).findFirst().orElse(new HistoryTrack(user, track)).setListenTime(new Date());
        } else {
            user.getHistoryTracks().add(new HistoryTrack(user, track));
        }
    }

    @Override
    public List<TrackDTO> getHistoryTracks(String username) {
        User user = userDAO.getByUsername(username);
        return user.getHistoryTracks().stream().map(historyTrack -> {
            TrackDTO track = new TrackDTO();
            track.setId(historyTrack.getTrack().getId());
            track.setTitle(historyTrack.getTrack().getTitle());
            track.setArtist(historyTrack.getTrack().getArtist());
            track.setDuration(historyTrack.getTrack().getDuration());
            track.setTags(historyTrack.getTrack().getTags());
            track.setDescription(historyTrack.getTrack().getDescription());
            track.setPrivacy(historyTrack.getTrack().getPrivacy());
            track.setPlays(historyTrack.getTrack().getPlays());
            track.setExt(historyTrack.getTrack().getExt());
            track.setUploadTime(historyTrack.getTrack().getUploadTime());
            if (historyTrack.getTrack().getImageUrl() != null) {
                track.setImageUrl(historyTrack.getTrack().getImageUrl());
            }
            track.setComposer(historyTrack.getTrack().getComposer());
            track.setCode(historyTrack.getTrack().getCode());
            UserDTO userDTO = new UserDTO();
            userDTO.setName(historyTrack.getTrack().getUploader().getName());
            userDTO.setUsername(historyTrack.getTrack().getUploader().getUsername());
            userDTO.setImageUrl(historyTrack.getTrack().getUploader().getImageUrl());
            track.setUploader(userDTO);
            return track;
        }).collect(Collectors.toList());
    }

    @Override
    public List<TrackDTO> getTracks(String username) {
        User user = userDAO.getByUsername(username);
        return user.getTracks().stream().map(t -> {
            TrackDTO track = new TrackDTO();
            track.setId(t.getId());
            track.setTitle(t.getTitle());
            track.setArtist(t.getArtist());
            track.setDuration(t.getDuration());
            track.setTags(t.getTags());
            track.setGenres(t.getGenres().stream().map(genre -> {
                GenreDTO genreDTO = new GenreDTO();
                genreDTO.setId(genre.getId());
                genreDTO.setCode(genre.getCode());
                genreDTO.setName(genre.getName());
                return genreDTO;
            }).collect(Collectors.toSet()));
            track.setDescription(t.getDescription());
            track.setPrivacy(t.getPrivacy());
            track.setPlays(t.getPlays());
            track.setExt(t.getExt());
            track.setUploadTime(t.getUploadTime());
            if (t.getImageUrl() != null) {
                track.setImageUrl(t.getImageUrl());
            }
            track.setComposer(t.getComposer());
            track.setCode(t.getCode());
            UserDTO userDTO = new UserDTO();
            userDTO.setName(t.getUploader().getName());
            userDTO.setUsername(t.getUploader().getUsername());
            userDTO.setImageUrl(t.getUploader().getImageUrl());
            track.setUploader(userDTO);
            return track;
        }).collect(Collectors.toList());
    }

    @Override
    public void deleteComment(Integer cmtId) {
        UserPrincipal userPrincipal = AdvancedSecurityContextHolder.getUserPrincipal();
        Comment comment = commentDAO.get(cmtId);
        if (comment.getUploader().getUsername().equals(userPrincipal.getUsername())) {
            commentDAO.remove(comment);
        }
    }

    @Override
    public PlaylistDTO createPlaylist(PlaylistDTO playlist) {
        Playlist p = new Playlist();
        p.setTitle(playlist.getTitle());
        p.setCode(playlist.getCode());
        p.setPrivacy(playlist.getPrivacy());
        p.setCreatedTime(new Date());
        UserPrincipal userPrincipal = AdvancedSecurityContextHolder.getUserPrincipal();
        User user = userDAO.getByUsername(userPrincipal.getUsername());
        p.setCreatedBy(user);
        user.getPlaylists().add(p);
        playlist.setId(p.getId());
        return playlist;
    }

    @Override
    public List<PlaylistDTO> getMyPlaylist(String username) {
        User user = userDAO.getByUsername(username);
        return user.getPlaylists().stream().map(playlist -> {
            PlaylistDTO p = new PlaylistDTO();
            p.setId(playlist.getId());
            p.setTitle(playlist.getTitle());
            p.setCode(playlist.getCode());
            p.setPrivacy(playlist.getPrivacy());
            UserDTO userDTO = new UserDTO();
            userDTO.setUsername(playlist.getCreatedBy().getUsername());
            userDTO.setName(playlist.getCreatedBy().getName());
            userDTO.setImageUrl(playlist.getCreatedBy().getImageUrl());
            p.setCreatedBy(userDTO);
            p.setTracks(playlist.getTracks().stream().map(k -> {
                TrackDTO trackDTO = new TrackDTO();
                trackDTO.setCode(k.getCode());
                trackDTO.setTitle(k.getTitle());
                trackDTO.setImageUrl(k.getImageUrl());
                return trackDTO;
            }).collect(Collectors.toSet()));
            return p;
        }).collect(Collectors.toList());
    }

    @Override
    public void addToPlaylist(Integer trackId, Integer playlistId) {
        UserPrincipal userPrincipal = AdvancedSecurityContextHolder.getUserPrincipal();
        Track track = trackDAO.get(trackId);
        Playlist playlist = userDAO.getByUsername(userPrincipal.getUsername()).getPlaylists().stream().filter(p -> p.getId().equals(playlistId)).findAny().orElse(null);
        if (playlist != null) {
            playlist.getTracks().add(track);
        }
    }

    @Override
    public void removeFromPlaylist(Integer trackId, Integer playlistId) {
        UserPrincipal userPrincipal = AdvancedSecurityContextHolder.getUserPrincipal();
        Track track = trackDAO.get(trackId);
        Playlist playlist = userDAO.getByUsername(userPrincipal.getUsername()).getPlaylists().stream().filter(p -> p.getId().equals(playlistId)).findAny().orElse(null);
        if (playlist != null) {
            playlist.getTracks().remove(track);
        }
    }

    @Override
    public UserDTO getMyAllInfo() {
        UserPrincipal userPrincipal = AdvancedSecurityContextHolder.getUserPrincipal();
        User user = userDAO.getByUsername(userPrincipal.getUsername());
        UserDTO userDTO = new UserDTO();
        userDTO.setId(user.getId());
        userDTO.setEmail(user.getEmail());
        userDTO.setUsername(user.getUsername());
        userDTO.setName(user.getName());
        userDTO.setImageUrl(user.getImageUrl());
        userDTO.setBio(user.getBio());
        userDTO.setCountry(user.getCountry());
        userDTO.setCity(user.getCity());
        return userDTO;
    }

    @Override
    public void updateProfile(UserFormData formData) throws IOException {
        UserPrincipal userPrincipal = AdvancedSecurityContextHolder.getUserPrincipal();
        User user = userDAO.get(formData.getId());
        if (user != null && user.getUsername().equals(userPrincipal.getUsername())) {
            user.setName(formData.getName());
            user.setBio(formData.getBio());
            user.setCity(formData.getCity());
            user.setCountry(formData.getCountry());

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
                File dir = new File(this.storagePath + File.separator + "user" + File.separator + userPrincipal.getUsername());
                if (!dir.exists()) dir.mkdirs();
                File imgFile = new File(this.storagePath + File.separator + "user" + File.separator + userPrincipal.getUsername() + File.separator + "avatar.jpg");
                ImageIO.write(resultImg, "jpg", imgFile);
                user.setImageUrl(BASE_URL + "/avatar/" + user.getUsername());
                userDAO.update(user);
            }
        }
    }

    @Override
    public boolean checkExistedUsername(String username) {
        User user = userDAO.getByUsername(username);
        UserPrincipal userPrincipal = AdvancedSecurityContextHolder.getUserPrincipal();
        if (userPrincipal != null) {
            if (user != null) {
                return !user.getUsername().equals(userPrincipal.getUsername());
            }
            return false;
        }
        return user == null;
    }

    @Override
    public User generatePasswordResetToken(String username) {
        User user = userDAO.getByUsername(username);
        user.setPasswordResetToken(UUID.randomUUID().toString());
        userDAO.update(user);
        (new Thread(() -> emailService.sendPasswordResetEmail(user))).start();
        return user;
    }

    @Override
    public void changeUsername(String username) {
        UserPrincipal userPrincipal = AdvancedSecurityContextHolder.getUserPrincipal();
        User user = userDAO.getByUsername(userPrincipal.getUsername());
        user.setUsername(username);
        userDAO.update(user);
    }

    @Override
    public boolean resetPassword(ResetPassword resetPassword) {
        User user = userDAO.getByResetPasswordToken(resetPassword.getToken());
        if (user != null) {
            user.setEncodedPassword(passwordEncoder.encode(resetPassword.getNewPassword()));
            user.setPasswordResetToken(null);
            userDAO.update(user);
            UserDTO userDTO = new UserDTO();
            userDTO.setId(user.getId());
            userDTO.setName(user.getName());
            userDTO.setEmail(user.getEmail());
            return true;
        }
        return false;
    }

    @Override
    public void generatePasswordResetTokenWithEmail(String email) {
        User user = userDAO.getByEmail(email);
        user.setPasswordResetToken(UUID.randomUUID().toString());
        userDAO.update(user);
        (new Thread(() -> emailService.sendPasswordResetEmail(user))).start();
    }
}
