package com.nyat.raku.entity;

import lombok.Data;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.util.Set;

@Data
@Entity
@Table(name = "tbl_playlist")
@EntityListeners(AuditingEntityListener.class)
public class Playlist {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @CreatedBy
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "created_by", nullable = false, referencedColumnName = "id")
    private User createdBy;

    @Column(name = "title")
    private String title;

    @Column(name = "is_public", nullable = false)
    private boolean isPublic;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "playlist_track",
            joinColumns = {@JoinColumn(name = "playlist_id", referencedColumnName = "id")},
            inverseJoinColumns = {@JoinColumn(name = "track_id", referencedColumnName = "id")},
            uniqueConstraints = {@UniqueConstraint(columnNames = {"playlist_id", "track_id"})})
    private Set<Track> tracks;
}
