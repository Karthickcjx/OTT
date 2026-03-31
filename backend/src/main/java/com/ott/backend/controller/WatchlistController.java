package com.ott.backend.controller;

import com.ott.backend.dto.WatchlistItemDto;
import com.ott.backend.dto.WatchlistRequest;
import com.ott.backend.entity.User;
import com.ott.backend.service.WatchlistService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/watchlist")
@RequiredArgsConstructor
public class WatchlistController {

    private final WatchlistService watchlistService;

    @GetMapping
    public ResponseEntity<List<WatchlistItemDto>> getWatchlist(@AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(watchlistService.getWatchlist(currentUser));
    }

    @PostMapping
    public ResponseEntity<WatchlistItemDto> addToWatchlist(
            @Valid @RequestBody WatchlistRequest request,
            @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(watchlistService.addToWatchlist(request, currentUser));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> removeFromWatchlist(
            @PathVariable Long id,
            @AuthenticationPrincipal User currentUser) {
        watchlistService.removeFromWatchlist(id, currentUser);
        return ResponseEntity.noContent().build();
    }
}
