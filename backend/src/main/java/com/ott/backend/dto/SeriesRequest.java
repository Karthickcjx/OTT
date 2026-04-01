package com.ott.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class SeriesRequest {

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    private String genre;

    @NotNull(message = "Release year is required")
    private Integer releaseYear;

    private String thumbnailUrl;

    private String bannerUrl;

    private List<SeasonData> seasons;

    @Data
    public static class SeasonData {
        private Integer seasonNumber;
        private List<EpisodeData> episodes;
    }

    @Data
    public static class EpisodeData {
        private Integer episodeNumber;
        private String title;
        private String videoUrl;
        private Integer duration;
    }
}
