package com.ott.backend.service;

import com.ott.backend.dto.MovieDto;
import com.ott.backend.dto.MovieRequest;
import com.ott.backend.entity.Movie;
import com.ott.backend.exception.ResourceNotFoundException;
import com.ott.backend.repository.MovieRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MovieService {

    private final MovieRepository movieRepository;

    public List<MovieDto> getAllMovies(String search, String genre, Integer year) {
        return movieRepository.findWithFilters(search, genre, year)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public MovieDto getMovieById(Long id) {
        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Movie not found with id: " + id));
        return toDto(movie);
    }

    public MovieDto createMovie(MovieRequest request) {
        Movie movie = Movie.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .genre(request.getGenre())
                .releaseYear(request.getReleaseYear())
                .thumbnailUrl(request.getThumbnailUrl())
                .bannerUrl(request.getBannerUrl())
                .videoUrl(request.getVideoUrl())
                .duration(request.getDuration())
                .rating(request.getRating())
                .build();
        return toDto(movieRepository.save(movie));
    }

    public MovieDto updateMovie(Long id, MovieRequest request) {
        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Movie not found with id: " + id));

        movie.setTitle(request.getTitle());
        movie.setDescription(request.getDescription());
        movie.setGenre(request.getGenre());
        movie.setReleaseYear(request.getReleaseYear());
        movie.setThumbnailUrl(request.getThumbnailUrl());
        movie.setBannerUrl(request.getBannerUrl());
        movie.setVideoUrl(request.getVideoUrl());
        movie.setDuration(request.getDuration());
        movie.setRating(request.getRating());

        return toDto(movieRepository.save(movie));
    }

    public void deleteMovie(Long id) {
        if (!movieRepository.existsById(id)) {
            throw new ResourceNotFoundException("Movie not found with id: " + id);
        }
        movieRepository.deleteById(id);
    }

    private MovieDto toDto(Movie movie) {
        return MovieDto.builder()
                .id(movie.getId())
                .title(movie.getTitle())
                .description(movie.getDescription())
                .genre(movie.getGenre())
                .releaseYear(movie.getReleaseYear())
                .thumbnailUrl(movie.getThumbnailUrl())
                .bannerUrl(movie.getBannerUrl())
                .videoUrl(movie.getVideoUrl())
                .duration(movie.getDuration())
                .rating(movie.getRating())
                .createdAt(movie.getCreatedAt())
                .build();
    }
}
