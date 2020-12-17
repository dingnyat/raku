package com.nyat.raku.entity;

import com.nyat.raku.security.AuthProvider;
import com.nyat.raku.security.Role;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "tbl_user")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "username", unique = true, nullable = false)
    private String username;

    @Column(name = "encoded_password", nullable = false)
    private String encodedPassword;

    @Column(name = "name", nullable = false)
    private String name;

    private String bio;

    private String city;

    private String country;

    @Column(name = "email", unique = true, nullable = false)
    private String email;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "email_verified", nullable = false)
    private Boolean emailVerified = false;

    @Column(name = "email_verification_key", nullable = false, unique = true)
    private String emailVerificationKey;

    @Column(name = "password_reset_token", unique = true)
    private String passwordResetToken;

    @Column(name = "provider_id")
    private String providerId;

    @Column(name = "role", nullable = false)
    @Enumerated(EnumType.STRING)
    private Role role;

    @Column(name = "auth_provider")
    @Enumerated(EnumType.STRING)
    private AuthProvider authProvider;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("listenTime desc ")
    private Set<HistoryTrack> historyTracks;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("repostTime desc ")
    private Set<RepostTrack> repostTracks;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "user_like_track",
            joinColumns = {@JoinColumn(name = "user_id", referencedColumnName = "id")},
            inverseJoinColumns = {@JoinColumn(name = "like_track_id", referencedColumnName = "id")},
            uniqueConstraints = {@UniqueConstraint(columnNames = {"user_id", "like_track_id"})})
    private Set<Track> likeTracks;

    @ManyToMany(fetch = FetchType.LAZY, mappedBy = "followingUsers")
    private Set<User> followers;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "user_following_user",
            joinColumns = {@JoinColumn(name = "user_id", referencedColumnName = "id")},
            inverseJoinColumns = {@JoinColumn(name = "following_user_id", referencedColumnName = "id")},
            uniqueConstraints = {@UniqueConstraint(columnNames = {"user_id", "following_user_id"})})
    private Set<User> followingUsers;

    @OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true, mappedBy = "createdBy")
    @OrderBy("createdTime desc ")
    private Set<Playlist> playlists;

    @OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true, mappedBy = "uploader")
    @OrderBy("uploadTime desc ")
    private Set<Track> tracks;

    @OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true, mappedBy = "user")
    @OrderBy("createdDate asc ")
    private Set<License> licenses;
}
