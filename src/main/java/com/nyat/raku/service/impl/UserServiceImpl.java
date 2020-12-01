package com.nyat.raku.service.impl;

import com.nyat.raku.dao.CommentDAO;
import com.nyat.raku.dao.TrackDAO;
import com.nyat.raku.dao.UserDAO;
import com.nyat.raku.entity.*;
import com.nyat.raku.model.CommentDTO;
import com.nyat.raku.model.TrackDTO;
import com.nyat.raku.model.UserDTO;
import com.nyat.raku.payload.CommentPayload;
import com.nyat.raku.payload.UserStats;
import com.nyat.raku.security.AdvancedSecurityContextHolder;
import com.nyat.raku.security.Role;
import com.nyat.raku.security.UserPrincipal;
import com.nyat.raku.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
            userDTO.setEmail(user.getEmail());
            userDTO.setUsername(user.getUsername());

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
        userStats.setTracks(user.getTracks().size());
        UserPrincipal userPrincipal = AdvancedSecurityContextHolder.getUserPrincipal();
        if (user.getFollowers().stream().anyMatch(u -> u.getUsername().equals(userPrincipal.getUsername()))) {
            userStats.setYouFollowing(true);
        }
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
}
