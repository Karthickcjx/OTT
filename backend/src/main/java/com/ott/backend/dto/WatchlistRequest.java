package com.ott.backend.dto;

import com.ott.backend.entity.WatchlistItem;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class WatchlistRequest {

    @NotNull(message = "Content ID is required")
    private Long contentId;

    @NotNull(message = "Content type is required")
    private WatchlistItem.ContentType contentType;
}
