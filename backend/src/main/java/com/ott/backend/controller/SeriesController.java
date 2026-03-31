package com.ott.backend.controller;

import com.ott.backend.dto.*;
import com.ott.backend.service.SeriesService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/series")
@RequiredArgsConstructor
public class SeriesController {

    private final SeriesService seriesService;

    @GetMapping
    public ResponseEntity<List<SeriesDto>> getAllSeries(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String genre,
            @RequestParam(required = false) Integer year) {
        return ResponseEntity.ok(seriesService.getAllSeries(search, genre, year));
    }

    @GetMapping("/{id}")
    public ResponseEntity<SeriesDto> getSeriesById(@PathVariable Long id) {
        return ResponseEntity.ok(seriesService.getSeriesById(id));
    }

    @PostMapping
    public ResponseEntity<SeriesDto> createSeries(@Valid @RequestBody SeriesRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(seriesService.createSeries(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SeriesDto> updateSeries(
            @PathVariable Long id,
            @Valid @RequestBody SeriesRequest request) {
        return ResponseEntity.ok(seriesService.updateSeries(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSeries(@PathVariable Long id) {
        seriesService.deleteSeries(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/seasons")
    public ResponseEntity<SeasonDto> addSeason(@Valid @RequestBody SeasonRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(seriesService.addSeason(request));
    }

    @PostMapping("/episodes")
    public ResponseEntity<EpisodeDto> addEpisode(@Valid @RequestBody EpisodeRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(seriesService.addEpisode(request));
    }
}
