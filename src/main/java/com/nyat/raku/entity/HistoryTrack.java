package com.nyat.raku.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.Date;

@Setter
@Getter
@Entity
@Table(name = "history_track", uniqueConstraints = {@UniqueConstraint(columnNames = {"user_id", "track_id"})})
public class HistoryTrack {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "track_id", referencedColumnName = "id", nullable = false)
    private Track track;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "listen_time", nullable = false)
    private Date listenTime;

    public HistoryTrack(User user, Track track) {
        this.user = user;
        this.track = track;
        this.listenTime = new Date();
    }

    public HistoryTrack() {
    }
}
