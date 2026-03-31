package com.ott.backend.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class SeriesDto {
    private Long id;
    private String title;
    private String description;
    private String genre;
    private Integer releaseYear;
    private String thumbnailUrl;
    private String bannerUrl;
    private List<SeasonDto> seasons;
}
