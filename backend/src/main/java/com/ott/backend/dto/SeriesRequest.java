package com.ott.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

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
}
