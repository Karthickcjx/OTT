package com.ott.backend.service;

import com.ott.backend.dto.WatchlistItemDto;
import com.ott.backend.dto.WatchlistRequest;
import com.ott.backend.entity.User;
import com.ott.backend.entity.WatchlistItem;

import com.ott.backend.repository.MovieRepository;
import com.ott.backend.repository.SeriesRepository;
import com.ott.backend.repository.WatchlistRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WatchlistService {

    private final WatchlistRepository watchlistRepository;
    private final MovieRepository movieRepository;
    private final SeriesRepository seriesRepository;

    public List<WatchlistItemDto> getWatchlist(User currentUser) {
        return watchlistRepository.findByUserId(currentUser.getId())
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public WatchlistItemDto addToWatchlist(WatchlistRequest request, User currentUser) {
        if (watchlistRepository.existsByUserIdAndContentIdAndContentType(
                currentUser.getId(), request.getContentId(), request.getContentType())) {
            throw new IllegalArgumentException("Item already in watchlist");
        }

        WatchlistItem item = WatchlistItem.builder()
                .user(currentUser)
                .contentId(request.getContentId())
                .contentType(request.getContentType())
                .build();

        return toDto(watchlistRepository.save(item));
    }

    public void removeFromWatchlist(Long itemId, User currentUser) {
        Optional<WatchlistItem> item = watchlistRepository.findByIdAndUserId(itemId, currentUser.getId());
        
        if (item.isPresent()) {
            watchlistRepository.delete(item.get());
        } else {
            // Also allow removing by content ID as fallback, used by frontend UI optimistic updates
            watchlistRepository.findByUserId(currentUser.getId()).stream()
                    .filter(w -> w.getContentId().equals(itemId))
                    .findFirst()
                    .ifPresent(watchlistRepository::delete);
        }
    }

    private WatchlistItemDto toDto(WatchlistItem item) {
        WatchlistItemDto.WatchlistItemDtoBuilder builder = WatchlistItemDto.builder()
                .id(item.getContentId()) // FE components use item.id for navigating, so supply contentId
                .userId(item.getUser().getId())
                .contentId(item.getContentId())
                .contentType(item.getContentType().name());

        if (item.getContentType() == WatchlistItem.ContentType.MOVIE) {
            movieRepository.findById(item.getContentId()).ifPresent(movie -> {
                builder.title(movie.getTitle())
                       .description(movie.getDescription())
                       .genre(movie.getGenre())
                       .releaseYear(movie.getReleaseYear())
                       .thumbnailUrl(movie.getThumbnailUrl())
                       .bannerUrl(movie.getBannerUrl())
                       .rating(movie.getRating())
                       .type("movie");
            });
        } else if (item.getContentType() == WatchlistItem.ContentType.SERIES) {
            seriesRepository.findById(item.getContentId()).ifPresent(series -> {
                builder.title(series.getTitle())
                       .description(series.getDescription())
                       .genre(series.getGenre())
                       .releaseYear(series.getReleaseYear())
                       .thumbnailUrl(series.getThumbnailUrl())
                       .bannerUrl(series.getBannerUrl())
                       .type("series");
            });
        }
        
        return builder.build();
    }
}
