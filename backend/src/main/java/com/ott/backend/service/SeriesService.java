package com.ott.backend.service;

import com.ott.backend.dto.*;
import com.ott.backend.entity.Episode;
import com.ott.backend.entity.Season;
import com.ott.backend.entity.Series;
import com.ott.backend.exception.ResourceNotFoundException;
import com.ott.backend.repository.EpisodeRepository;
import com.ott.backend.repository.SeasonRepository;
import com.ott.backend.repository.SeriesRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SeriesService {

    private final SeriesRepository seriesRepository;
    private final SeasonRepository seasonRepository;
    private final EpisodeRepository episodeRepository;

    public List<SeriesDto> getAllSeries(String search, String genre, Integer year) {
        return seriesRepository.findWithFilters(search, genre, year)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public SeriesDto getSeriesById(Long id) {
        Series series = seriesRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Series not found with id: " + id));
        return toDto(series);
    }

    @Transactional
    public SeriesDto createSeries(SeriesRequest request) {
        Series series = Series.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .genre(request.getGenre())
                .releaseYear(request.getReleaseYear())
                .thumbnailUrl(request.getThumbnailUrl())
                .bannerUrl(request.getBannerUrl())
                .build();
        series = seriesRepository.save(series);

        if (request.getSeasons() != null) {
            for (SeriesRequest.SeasonData sd : request.getSeasons()) {
                Season season = Season.builder()
                        .seasonNumber(sd.getSeasonNumber())
                        .series(series)
                        .build();
                season = seasonRepository.save(season);

                if (sd.getEpisodes() != null) {
                    for (SeriesRequest.EpisodeData ed : sd.getEpisodes()) {
                        String episodeTitle = (ed.getTitle() != null && !ed.getTitle().isBlank())
                                ? ed.getTitle()
                                : "Episode " + ed.getEpisodeNumber();
                        Episode episode = Episode.builder()
                                .title(episodeTitle)
                                .episodeNumber(ed.getEpisodeNumber())
                                .videoUrl(ed.getVideoUrl())
                                .duration(ed.getDuration())
                                .season(season)
                                .build();
                        episodeRepository.save(episode);
                    }
                }
            }
        }

        return toDto(seriesRepository.findById(series.getId()).orElseThrow());
    }

    public SeriesDto updateSeries(Long id, SeriesRequest request) {
        Series series = seriesRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Series not found with id: " + id));

        series.setTitle(request.getTitle());
        series.setDescription(request.getDescription());
        series.setGenre(request.getGenre());
        series.setReleaseYear(request.getReleaseYear());
        series.setThumbnailUrl(request.getThumbnailUrl());
        series.setBannerUrl(request.getBannerUrl());

        return toDto(seriesRepository.save(series));
    }

    public void deleteSeries(Long id) {
        if (!seriesRepository.existsById(id)) {
            throw new ResourceNotFoundException("Series not found with id: " + id);
        }
        seriesRepository.deleteById(id);
    }

    @Transactional
    public SeasonDto addSeason(SeasonRequest request) {
        Series series = seriesRepository.findById(request.getSeriesId())
                .orElseThrow(() -> new ResourceNotFoundException("Series not found with id: " + request.getSeriesId()));

        Season season = Season.builder()
                .seasonNumber(request.getSeasonNumber())
                .series(series)
                .build();
        return toSeasonDto(seasonRepository.save(season));
    }

    @Transactional
    public EpisodeDto addEpisode(EpisodeRequest request) {
        Season season = seasonRepository.findById(request.getSeasonId())
                .orElseThrow(() -> new ResourceNotFoundException("Season not found with id: " + request.getSeasonId()));

        Episode episode = Episode.builder()
                .title(request.getTitle())
                .episodeNumber(request.getEpisodeNumber())
                .videoUrl(request.getVideoUrl())
                .duration(request.getDuration())
                .season(season)
                .build();
        return toEpisodeDto(episodeRepository.save(episode));
    }

    private SeriesDto toDto(Series series) {
        List<SeasonDto> seasons = series.getSeasons().stream()
                .map(this::toSeasonDto)
                .collect(Collectors.toList());

        return SeriesDto.builder()
                .id(series.getId())
                .title(series.getTitle())
                .description(series.getDescription())
                .genre(series.getGenre())
                .releaseYear(series.getReleaseYear())
                .thumbnailUrl(series.getThumbnailUrl())
                .bannerUrl(series.getBannerUrl())
                .seasons(seasons)
                .build();
    }

    private SeasonDto toSeasonDto(Season season) {
        List<EpisodeDto> episodes = season.getEpisodes().stream()
                .map(this::toEpisodeDto)
                .collect(Collectors.toList());

        return SeasonDto.builder()
                .id(season.getId())
                .seasonNumber(season.getSeasonNumber())
                .seriesId(season.getSeries().getId())
                .episodes(episodes)
                .build();
    }

    private EpisodeDto toEpisodeDto(Episode episode) {
        return EpisodeDto.builder()
                .id(episode.getId())
                .title(episode.getTitle())
                .episodeNumber(episode.getEpisodeNumber())
                .videoUrl(episode.getVideoUrl())
                .duration(episode.getDuration())
                .seasonId(episode.getSeason().getId())
                .build();
    }
}
