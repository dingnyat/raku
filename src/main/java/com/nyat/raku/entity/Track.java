package com.nyat.raku.entity;

import com.nyat.raku.model.Privacy;
import lombok.Data;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.util.Date;
import java.util.Set;

@Data
@Entity
@Table(name = "tbl_track", uniqueConstraints = {@UniqueConstraint(columnNames = {"code", "uploader_id"})})
@EntityListeners(AuditingEntityListener.class)
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
    @CreatedDate
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

    @CreatedBy
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
}
