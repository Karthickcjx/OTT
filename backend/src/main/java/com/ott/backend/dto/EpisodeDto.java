package com.ott.backend.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class EpisodeDto {
    private Long id;
    private String title;
    private Integer episodeNumber;
    private String videoUrl;
    private Integer duration;
    private Long seasonId;
}
