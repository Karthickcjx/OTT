package com.ott.backend.repository;

import com.ott.backend.entity.WatchlistItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface WatchlistRepository extends JpaRepository<WatchlistItem, Long> {
    List<WatchlistItem> findByUserId(Long userId);
    Optional<WatchlistItem> findByIdAndUserId(Long id, Long userId);
    boolean existsByUserIdAndContentIdAndContentType(Long userId, Long contentId, WatchlistItem.ContentType contentType);
}
