package com.ott.backend.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class MovieDto {
    private Long id;
    private String title;
    private String description;
    private String genre;
    private Integer releaseYear;
    private String thumbnailUrl;
    private String bannerUrl;
    private String videoUrl;
    private Integer duration;
    private Double rating;
    private LocalDateTime createdAt;
}
