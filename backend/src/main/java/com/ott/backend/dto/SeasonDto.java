package com.ott.backend.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class SeasonDto {
    private Long id;
    private Integer seasonNumber;
    private Long seriesId;
    private List<EpisodeDto> episodes;
}
