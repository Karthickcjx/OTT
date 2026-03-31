package com.ott.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class EpisodeRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotNull(message = "Episode number is required")
    private Integer episodeNumber;

    private String videoUrl;

    private Integer duration;

    @NotNull(message = "Season ID is required")
    private Long seasonId;
}
