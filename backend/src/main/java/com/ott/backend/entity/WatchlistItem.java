package com.ott.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "watchlist_items",
       uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "content_id", "content_type"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WatchlistItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private Long contentId;

    @Enumerated(EnumType.STRING)
    @Column(name = "content_type", nullable = false)
    private ContentType contentType;

    public enum ContentType {
        MOVIE, SERIES
    }
}
