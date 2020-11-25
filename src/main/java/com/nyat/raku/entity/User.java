package com.nyat.raku.entity;

import com.nyat.raku.security.AuthProvider;
import com.nyat.raku.security.Role;

import javax.persistence.*;
import java.util.Set;

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

    @Column(name = "email", unique = true, nullable = false)
    private String email;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "email_verified", nullable = false)
    private Boolean emailVerified = false;

    @Column(name = "email_verification_key", nullable = false, unique = true)
    private String emailVerificationKey;

    @Column(name = "provider_id")
    private String providerId;

    @Column(name = "role", nullable = false)
    @Enumerated(EnumType.STRING)
    private Role role;

    @Column(name = "auth_provider")
    @Enumerated(EnumType.STRING)
    private AuthProvider authProvider;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "user_repost_track",
            joinColumns = {@JoinColumn(name = "user_id", referencedColumnName = "id")},
            inverseJoinColumns = {@JoinColumn(name = "track_id", referencedColumnName = "id")},
            uniqueConstraints = {@UniqueConstraint(columnNames = {"user_id", "track_id"})})
    private Set<Track> repostTracks;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "user_history_track",
            joinColumns = {@JoinColumn(name = "user_id", referencedColumnName = "id")},
            inverseJoinColumns = {@JoinColumn(name = "track_id", referencedColumnName = "id")},
            uniqueConstraints = {@UniqueConstraint(columnNames = {"user_id", "track_id"})})
    private Set<Track> historyTracks;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "user_like_track",
            joinColumns = {@JoinColumn(name = "user_id", referencedColumnName = "id")},
            inverseJoinColumns = {@JoinColumn(name = "like_track_id", referencedColumnName = "id")},
            uniqueConstraints = {@UniqueConstraint(columnNames = {"user_id", "like_track_id"})})
    private Set<Track> likeTracks;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "user_follower",
            joinColumns = {@JoinColumn(name = "user_id", referencedColumnName = "id")},
            inverseJoinColumns = {@JoinColumn(name = "follower_id", referencedColumnName = "id")},
            uniqueConstraints = {@UniqueConstraint(columnNames = {"user_id", "follower_id"})})
    private Set<User> followers;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "user_following_user",
            joinColumns = {@JoinColumn(name = "user_id", referencedColumnName = "id")},
            inverseJoinColumns = {@JoinColumn(name = "following_user_id", referencedColumnName = "id")},
            uniqueConstraints = {@UniqueConstraint(columnNames = {"user_id", "following_user_id"})})
    private Set<User> followingUsers;

    @OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Playlist> playlists;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEncodedPassword() {
        return encodedPassword;
    }

    public void setEncodedPassword(String encodedPassword) {
        this.encodedPassword = encodedPassword;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public Boolean getEmailVerified() {
        return emailVerified;
    }

    public void setEmailVerified(Boolean emailVerified) {
        this.emailVerified = emailVerified;
    }

    public String getEmailVerificationKey() {
        return emailVerificationKey;
    }

    public void setEmailVerificationKey(String emailVerificationKey) {
        this.emailVerificationKey = emailVerificationKey;
    }

    public String getProviderId() {
        return providerId;
    }

    public void setProviderId(String providerId) {
        this.providerId = providerId;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public AuthProvider getAuthProvider() {
        return authProvider;
    }

    public void setAuthProvider(AuthProvider authProvider) {
        this.authProvider = authProvider;
    }

    public Set<Track> getRepostTracks() {
        return repostTracks;
    }

    public void setRepostTracks(Set<Track> repostTracks) {
        this.repostTracks = repostTracks;
    }

    public Set<Track> getHistoryTracks() {
        return historyTracks;
    }

    public void setHistoryTracks(Set<Track> historyTracks) {
        this.historyTracks = historyTracks;
    }

    public Set<Track> getLikeTracks() {
        return likeTracks;
    }

    public void setLikeTracks(Set<Track> likeTracks) {
        this.likeTracks = likeTracks;
    }

    public Set<User> getFollowers() {
        return followers;
    }

    public void setFollowers(Set<User> followers) {
        this.followers = followers;
    }

    public Set<User> getFollowingUsers() {
        return followingUsers;
    }

    public void setFollowingUsers(Set<User> followingUsers) {
        this.followingUsers = followingUsers;
    }

    public Set<Playlist> getPlaylists() {
        return playlists;
    }

    public void setPlaylists(Set<Playlist> playlists) {
        this.playlists = playlists;
    }
}
