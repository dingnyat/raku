package com.nyat.raku.service;


import com.nyat.raku.entity.User;
import com.nyat.raku.model.CommentDTO;
import com.nyat.raku.model.PlaylistDTO;
import com.nyat.raku.model.TrackDTO;
import com.nyat.raku.model.UserDTO;
import com.nyat.raku.payload.CommentPayload;
import com.nyat.raku.payload.ResetPassword;
import com.nyat.raku.payload.UserFormData;
import com.nyat.raku.payload.UserStats;

import java.io.IOException;
import java.util.List;

public interface UserService {
    User create(UserDTO userDTO);

    UserDTO get(Integer id);

    List<UserDTO> getAll();

    void update(UserDTO userDTO);

    void delete(Integer id);

    boolean existsByEmail(String email);

    boolean existsByUsername(String username);

    UserDTO getByVerificationKey(String key);

    void verifyAccount(Integer id);

    UserDTO getByUsername(String username);

    void likeTrack(Integer trackId, String username);

    void repostTrack(Integer trackId, String username);

    void followUser(String followUsername, String actUsername);

    CommentDTO comment(CommentPayload commentPayload);

    UserStats getUserStats(String username);

    void setHistory(String uploader, String code, String username);

    List<TrackDTO> getHistoryTracks(String username);

    List<TrackDTO> getTracks(String username);

    void deleteComment(Integer cmtId);

    PlaylistDTO createPlaylist(PlaylistDTO playlist);

    List<PlaylistDTO> getMyPlaylist(String username);

    void addToPlaylist(Integer trackId, Integer playlistId);

    void removeFromPlaylist(Integer trackId, Integer playlistId);

    UserDTO getMyAllInfo();

    void updateProfile(UserFormData formData) throws IOException;

    boolean checkExistedUsername(String username);

    User generatePasswordResetToken(String username);

    void changeUsername(String username);

    boolean resetPassword(ResetPassword resetPassword);

    void generatePasswordResetTokenWithEmail(String email);
}
