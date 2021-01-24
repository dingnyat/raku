package com.nyat.raku.service.impl;

import com.nyat.raku.dao.GenreDAO;
import com.nyat.raku.dao.TrackDAO;
import com.nyat.raku.dao.UserDAO;
import com.nyat.raku.entity.Comment;
import com.nyat.raku.entity.Track;
import com.nyat.raku.entity.User;
import com.nyat.raku.model.*;
import com.nyat.raku.payload.SearchPayload;
import com.nyat.raku.payload.SearchResult;
import com.nyat.raku.payload.TrackStats;
import com.nyat.raku.payload.UserTrackInfo;
import com.nyat.raku.security.AdvancedSecurityContextHolder;
import com.nyat.raku.security.UserPrincipal;
import com.nyat.raku.service.TrackService;
import com.nyat.raku.util.DateTimeUtils;
import com.nyat.raku.util.Privacy;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.File;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class TrackServiceImpl implements TrackService {

    @Autowired
    private TrackDAO trackDAO;

    @Autowired
    private GenreDAO genreDAO;

    @Autowired
    private UserDAO userDAO;

    @Value("${raku.root-path}")
    private String storagePath;

    @Override
    public TrackDTO create(TrackDTO trackDTO) {
        Track track = new Track();
        track.setTitle(trackDTO.getTitle());
        track.setCode(trackDTO.getCode());
        track.setComposer(trackDTO.getComposer());
        track.setArtist(trackDTO.getArtist());
        track.setDescription(trackDTO.getDescription());
        track.setPlays(0);
        UserPrincipal userPrincipal = AdvancedSecurityContextHolder.getUserPrincipal();
        User user = userDAO.getByUsername(userPrincipal.getUsername());
        track.setUploader(user);
        track.setUploadTime(DateTimeUtils.getCurrentDateTime());
        track.setPrivacy(trackDTO.getPrivacy());
        track.setDuration(trackDTO.getDuration());
        track.setImageUrl(trackDTO.getImageUrl());
        track.setExt(trackDTO.getExt());
        track.setTags(trackDTO.getTags());
        if (trackDTO.getGenres() != null) {
            track.setGenres(trackDTO.getGenres().stream().map(genreDTO -> genreDAO.get(genreDTO.getId())).collect(Collectors.toSet()));
        }
        trackDAO.create(track);
        UserDTO userDTO = new UserDTO();
        userDTO.setName(track.getUploader().getName());
        userDTO.setUsername(track.getUploader().getUsername());
        trackDTO.setUploader(userDTO);
        return trackDTO;
    }

    @Override
    public TrackDTO get(Integer id) {
        return null;
    }

    @Override
    public List<TrackDTO> getAll() {
        return null;
    }

    @Override
    public void update(TrackDTO trackDTO) {
        Track track = trackDAO.get(trackDTO.getId());
        UserPrincipal userPrincipal = AdvancedSecurityContextHolder.getUserPrincipal();
        if (track.getUploader().getUsername().equals(userPrincipal.getUsername())) {
            track.setTitle(trackDTO.getTitle());
            track.setComposer(trackDTO.getComposer());
            track.setArtist(trackDTO.getArtist());
            track.setDescription(trackDTO.getDescription());
            track.setPrivacy(trackDTO.getPrivacy());
            if (trackDTO.getImageUrl() != null) {
                track.setImageUrl(trackDTO.getImageUrl());
            }
            track.setTags(trackDTO.getTags());
            if (trackDTO.getGenres() != null) {
                track.setGenres(trackDTO.getGenres().stream().map(genreDTO -> genreDAO.get(genreDTO.getId())).collect(Collectors.toSet()));
            }
            if (!trackDTO.getCode().equals(track.getCode())) {
                File tempAudio = new File(this.storagePath + File.separator + "user" + File.separator + userPrincipal.getUsername() + File.separator + "audio" + File.separator + track.getCode() + track.getExt());
                File finalAudio = new File(this.storagePath + File.separator + "user" + File.separator + userPrincipal.getUsername() + File.separator + "audio" + File.separator + trackDTO.getCode() + track.getExt());
                tempAudio.renameTo(finalAudio);
                track.setCode(trackDTO.getCode());
            }
        }
    }

    @Override
    public void delete(Integer id) {
        UserPrincipal userPrincipal = AdvancedSecurityContextHolder.getUserPrincipal();
        Track track = trackDAO.get(id);
        if (track.getUploader().getUsername().equals(userPrincipal.getUsername())) {
            trackDAO.delete(track);
        }
    }

    @Override
    public TrackDTO getByCode(String username, String code) throws Exception {
        Track track = trackDAO.getByCode(username, code);
        TrackDTO trackDTO = new TrackDTO();
        trackDTO.setId(track.getId());
        trackDTO.setTitle(track.getTitle());
        trackDTO.setArtist(track.getArtist());
        trackDTO.setDuration(track.getDuration());
        trackDTO.setTags(track.getTags());
        trackDTO.setDescription(track.getDescription());
        trackDTO.setPrivacy(track.getPrivacy());
        trackDTO.setPlays(track.getPlays());
        trackDTO.setExt(track.getExt());
        trackDTO.setUploadTime(track.getUploadTime());
        if (track.getImageUrl() != null) {
            trackDTO.setImageUrl(track.getImageUrl());
        }
        trackDTO.setComposer(track.getComposer());
        trackDTO.setCode(track.getCode());
        trackDTO.setGenres(track.getGenres().stream().map(genre -> {
            GenreDTO genreDTO = new GenreDTO();
            genreDTO.setId(genre.getId());
            genreDTO.setCode(genre.getCode());
            genreDTO.setName(genre.getName());
            return genreDTO;
        }).collect(Collectors.toSet()));
        UserDTO userDTO = new UserDTO();
        userDTO.setName(track.getUploader().getName());
        userDTO.setUsername(track.getUploader().getUsername());
        userDTO.setImageUrl(track.getUploader().getImageUrl());
        trackDTO.setUploader(userDTO);
        trackDTO.setComments(new LinkedHashSet<>());
        if (track.getComments() != null) {
            track.getComments().forEach(comment -> {
                CommentDTO cmt = new CommentDTO();
                setComment(comment, cmt);
                trackDTO.getComments().add(cmt);
            });
        }
        return trackDTO;
    }

    private void setComment(Comment comment, CommentDTO cmt) {
        cmt.setContent(comment.getContent());
        cmt.setId(comment.getId());
        cmt.setTime(comment.getCreatedDate());
        UserDTO uploader = new UserDTO();
        uploader.setName(comment.getUploader().getName());
        uploader.setId(comment.getUploader().getId());
        uploader.setUsername(comment.getUploader().getUsername());
        if (comment.getUploader().getImageUrl() != null) {
            uploader.setImageUrl(comment.getUploader().getImageUrl());
        }
        cmt.setUploader(uploader);
        cmt.setChildren(new LinkedHashSet<>());
        if (comment.getChildren() != null && comment.getChildren().size() > 0) {
            comment.getChildren().forEach(commentEntity -> {
                CommentDTO cmtDTO = new CommentDTO();
                setComment(commentEntity, cmtDTO);
                cmt.getChildren().add(cmtDTO);
            });
        }
    }

    @Override
    public UserTrackInfo getUserTrackInfo(String uploader, String code, String username) {
        try {
            UserTrackInfo userTrackInfo = new UserTrackInfo();
            Track track = trackDAO.getByCode(uploader, code);
            User user = userDAO.getByUsername(username);
            if (user.getLikeTracks() != null && user.getLikeTracks().stream().anyMatch(t -> t.getUploader().getUsername().equals(uploader) && t.getCode().equals(code))) {
                userTrackInfo.setLike(true);
            }
            if (user.getRepostTracks() != null && user.getRepostTracks().stream().anyMatch(t -> t.getTrack().getId().equals(track.getId()))) {
                userTrackInfo.setRepost(true);
            }
            userTrackInfo.setPlaylists(new LinkedHashSet<>());
            if (user.getPlaylists() != null) {
                user.getPlaylists().forEach(playlist -> {
                    if (playlist.getTracks().stream().anyMatch(t -> t.getCode().equals(code) && t.getUploader().getUsername().equals(uploader))) {
                        PlaylistDTO pl = new PlaylistDTO();
                        pl.setId(playlist.getId());
                        pl.setCode(playlist.getCode());
                        pl.setTitle(playlist.getTitle());
                        userTrackInfo.getPlaylists().add(pl);
                    }
                });
            }
            return userTrackInfo;
        } catch (Exception e) {
            return null;
        }
    }

    @Override
    public TrackStats getTrackStats(String username, String code) throws Exception {
        Track track = trackDAO.getByCode(username, code);
        TrackStats trackStats = new TrackStats();
        // todo tính lại số comment. tính cả subcomment
        trackStats.setComment(track.getComments().size());
        trackStats.setLike(track.getLikes().size());
        trackStats.setPlays(track.getPlays());
        trackStats.setRepost(track.getReposts().size());
        return trackStats;
    }

    @Override
    public List<TrackDTO> getTracksOf(String username) {
        User user = userDAO.getByUsername(username);
        UserPrincipal userPrincipal = AdvancedSecurityContextHolder.getUserPrincipal();
        return user.getTracks()
                .stream()
                .filter(t -> t.getPrivacy().equals(Privacy._PUBLIC) || (userPrincipal != null && username.equals(userPrincipal.getUsername())))
                .map(t -> {
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
    public List<TrackDTO> getRepostTracksOf(String username) {
        User user = userDAO.getByUsername(username); // ton tai loi bao mat
        return user.getRepostTracks()
                .stream()
                .map(repostTrack -> {
                    Track t = repostTrack.getTrack();
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
    public List<PlaylistDTO> getPlaylistsOf(String username) {
        UserPrincipal userPrincipal = AdvancedSecurityContextHolder.getUserPrincipal();
        User user = userDAO.getByUsername(username);
        return user.getPlaylists()
                .stream()
                .filter(t -> t.getPrivacy().equals(Privacy._PUBLIC) || (userPrincipal != null && username.equals(userPrincipal.getUsername())))
                .map(playlist -> {
                    PlaylistDTO dto = new PlaylistDTO();
                    dto.setId(playlist.getId());
                    dto.setCode(playlist.getCode());
                    dto.setCreatedTime(playlist.getCreatedTime());
                    UserDTO userDTO = new UserDTO();
                    userDTO.setId(playlist.getCreatedBy().getId());
                    userDTO.setUsername(playlist.getCreatedBy().getUsername());
                    userDTO.setName(playlist.getCreatedBy().getName());
                    dto.setCreatedBy(userDTO);
                    dto.setPrivacy(playlist.getPrivacy());
                    dto.setTitle(playlist.getTitle());
                    dto.setTracks(playlist.getTracks().stream().map(t -> {
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
                        UserDTO u = new UserDTO();
                        u.setName(t.getUploader().getName());
                        u.setUsername(t.getUploader().getUsername());
                        u.setImageUrl(t.getUploader().getImageUrl());
                        track.setUploader(u);
                        return track;
                    }).collect(Collectors.toSet()));
                    return dto;
                }).collect(Collectors.toList());
    }

    @Override
    public SearchResult search(SearchPayload searchPayload) {
        return trackDAO.search(searchPayload);
    }

    @Override
    public List<TrackDTO> getTracksByTag(String tagCode) {
        return trackDAO.getTracksByTag(tagCode).stream().map(t -> {
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
    public List<TrackDTO> getTop40() {
        return trackDAO.getTop40().stream().map(t -> {
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
    public List<TrackDTO> getNewestTracks() {
        return trackDAO.getNewestTracks().stream().map(t -> {
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
    public void countPlay(String username, String code) {
        Track track = trackDAO.getByCode(username, code);
        track.setPlays(track.getPlays() + 1);
    }
}
