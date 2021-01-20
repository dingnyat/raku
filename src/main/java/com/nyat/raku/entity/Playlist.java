package com.nyat.raku.entity;

import com.nyat.raku.util.Privacy;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.Date;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "tbl_playlist", uniqueConstraints = {@UniqueConstraint(columnNames = {"code", "created_by"})})
public class Playlist {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "created_by", nullable = false, referencedColumnName = "id")
    private User createdBy;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "created_time", nullable = false)
    private Date createdTime;

    @Column(name = "code", nullable = false)
    private String code;

    @Column(name = "title")
    private String title;

    @Column(name = "privacy", nullable = false)
    @Enumerated(EnumType.STRING)
    private Privacy privacy;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "playlist_track",
            joinColumns = {@JoinColumn(name = "playlist_id", referencedColumnName = "id")},
            inverseJoinColumns = {@JoinColumn(name = "track_id", referencedColumnName = "id")},
            uniqueConstraints = {@UniqueConstraint(columnNames = {"playlist_id", "track_id"})})
    @OrderBy("uploadTime desc") // todo sắp xếp theo thứ tự mình add vào hoặc tùy chỉnh (phức tạp)
    private Set<Track> tracks;
}
