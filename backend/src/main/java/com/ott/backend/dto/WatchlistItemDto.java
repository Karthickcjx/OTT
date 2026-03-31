package com.ott.backend.dto;

import com.ott.backend.entity.WatchlistItem;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class WatchlistItemDto {
    private Long id;
    private Long userId;
    private Long contentId;
    private String contentType;

    // Enriched fields for UI
    private String title;
    private String description;
    private String genre;
    private Integer releaseYear;
    private String thumbnailUrl;
    private String bannerUrl;
    private String type; // 'movie' or 'series'
    private Double rating;
}
