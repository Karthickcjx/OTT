package com.ott.backend.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SeasonRequest {

    @NotNull(message = "Season number is required")
    private Integer seasonNumber;

    @NotNull(message = "Series ID is required")
    private Long seriesId;
}
