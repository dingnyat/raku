package com.nyat.raku.entity;

import com.nyat.raku.model.Privacy;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.Date;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "tbl_track", uniqueConstraints = {@UniqueConstraint(columnNames = {"code", "uploader_id"})})
public class Track {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "code", nullable = false)
    private String code;

    @Column(name = "ext")
    private String ext;

    @Column(name = "upload_time", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date uploadTime;

    @Column(name = "description", columnDefinition = "text")
    private String description;

    @Column(name = "privacy", nullable = false)
    @Enumerated(EnumType.STRING)
    private Privacy privacy;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "composer")
    private String composer;

    @Column(name = "artist")
    private String artist;

    @Column(name = "duration")
    private String duration;

    @Column(name = "plays", columnDefinition = "integer default 0")
    private Integer plays;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "uploader_id", nullable = false, referencedColumnName = "id")
    private User uploader;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
            name = "track_tag",
            joinColumns = @JoinColumn(name = "track_id")
    )
    private Set<String> tags;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "track_genre",
            joinColumns = {@JoinColumn(name = "track_id", referencedColumnName = "id")},
            inverseJoinColumns = {@JoinColumn(name = "genre_id", referencedColumnName = "id")},
            uniqueConstraints = {@UniqueConstraint(columnNames = {"track_id", "genre_id"})})
    private Set<Genre> genres;

    @OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true, mappedBy = "track")
    @OrderBy("createdDate desc")
    private Set<Comment> comments;

    @ManyToMany(fetch = FetchType.LAZY, mappedBy = "likeTracks")
    private Set<User> likes;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "track", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private Set<RepostTrack> reposts;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "track", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private Set<HistoryTrack> historyTracks;

    @PreRemove
    private void removeLikeTrackFromUser() {
        likes.forEach(user -> user.getLikeTracks().remove(this));
    }
}
