package com.ott.backend.controller;

import com.ott.backend.service.MovieService;
import com.ott.backend.service.SeriesService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/search")
@RequiredArgsConstructor
public class SearchController {

    private final MovieService movieService;
    private final SeriesService seriesService;

    @GetMapping
    public ResponseEntity<List<Object>> search(@RequestParam String q) {
        List<Object> results = new ArrayList<>();
        results.addAll(movieService.getAllMovies(q, null, null));
        results.addAll(seriesService.getAllSeries(q, null, null));
        return ResponseEntity.ok(results);
    }
}
