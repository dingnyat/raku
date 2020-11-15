package com.nyat.raku.entity;

import lombok.Data;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.util.Date;
import java.util.Set;

@Data
@Entity
@Table(name = "tbl_track")
@EntityListeners(AuditingEntityListener.class)
public class Track {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "code", nullable = false, unique = true)
    private String code;

    @Column(name = "upload_time", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date uploadTime;

    @Column(name = "description", columnDefinition = "text")
    private String description;

    @Column(name = "privacy", nullable = false)
    private String privacy;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "composer")
    private String composer;

    @Column(name = "duration")
    private String duration;

    @Column(name = "plays", columnDefinition = "integer default 0")
    private Integer plays;

    @CreatedBy
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "uploader_id", nullable = false, referencedColumnName = "id")
    private User uploader;

    @ElementCollection
    @CollectionTable(
            name = "track_tag",
            joinColumns = @JoinColumn(name = "track_id")
    )
    private Set<String> tags;

    @ManyToMany(fetch = FetchType.EAGER, mappedBy = "tracks")
    private Set<Genre> genres;
}
