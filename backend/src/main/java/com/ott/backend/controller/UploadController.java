package com.ott.backend.controller;

import com.ott.backend.dto.UploadUrlRequest;
import com.ott.backend.dto.UploadUrlResponse;
import com.ott.backend.service.S3Service;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class UploadController {

    private final S3Service s3Service;

    @PostMapping("/upload-url")
    public ResponseEntity<UploadUrlResponse> getUploadUrl(@Valid @RequestBody UploadUrlRequest request) {
        return ResponseEntity.ok(s3Service.generatePresignedUploadUrl(request));
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file) {
        log.info("Upload request received: name={}, size={} bytes, contentType={}",
                file.getOriginalFilename(), file.getSize(), file.getContentType());

        if (file.isEmpty()) {
            log.warn("Rejected upload: file is empty");
            return ResponseEntity.badRequest().body(Map.of("error", "File is empty"));
        }

        try {
            String url = s3Service.uploadFile(file);
            log.info("Upload completed successfully: url={}", url);
            return ResponseEntity.ok(Map.of("url", url));
        } catch (Exception e) {
            log.error("Upload failed for file '{}' [{}]: {}", file.getOriginalFilename(),
                    e.getClass().getName(), e.getMessage(), e);
            return ResponseEntity.status(500).body(Map.of("error", "Upload failed: " + e.getMessage()));
        }
    }
}
