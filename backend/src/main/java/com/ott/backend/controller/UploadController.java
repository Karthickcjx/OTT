package com.ott.backend.controller;

import com.ott.backend.dto.UploadUrlRequest;
import com.ott.backend.dto.UploadUrlResponse;
import com.ott.backend.service.S3Service;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;

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
    public ResponseEntity<UploadUrlResponse> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            return ResponseEntity.ok(s3Service.uploadFile(file));
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
