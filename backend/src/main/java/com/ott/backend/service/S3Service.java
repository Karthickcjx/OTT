package com.ott.backend.service;

import com.ott.backend.dto.UploadUrlRequest;
import com.ott.backend.dto.UploadUrlResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.PresignedPutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.model.PutObjectPresignRequest;
import software.amazon.awssdk.services.s3.model.ObjectCannedACL;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectResponse;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;

import java.time.Duration;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class S3Service {

    private final S3Client s3Client;
    private final S3Presigner s3Presigner;

    @Value("${aws.s3.bucket-name}")
    private String bucketName;

    @Value("${aws.region}")
    private String awsRegion;

    public UploadUrlResponse generatePresignedUploadUrl(UploadUrlRequest request) {
        String uniqueKey = UUID.randomUUID() + "/" + sanitizeFileName(request.getFileName());

        PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(uniqueKey)
                .contentType(request.getFileType())
                .build();

        PutObjectPresignRequest presignRequest = PutObjectPresignRequest.builder()
                .signatureDuration(Duration.ofMinutes(15))
                .putObjectRequest(putObjectRequest)
                .build();

        PresignedPutObjectRequest presignedRequest = s3Presigner.presignPutObject(presignRequest);

        String fileUrl = String.format("https://%s.s3.%s.amazonaws.com/%s",
                bucketName, awsRegion, uniqueKey);

        return UploadUrlResponse.builder()
                .uploadUrl(presignedRequest.url().toString())
                .fileUrl(fileUrl)
                .build();
    }

    public String uploadFile(MultipartFile file) throws IOException {
        String originalFilename = file.getOriginalFilename() != null ? file.getOriginalFilename() : "upload";
        String uniqueKey = "uploads/" + UUID.randomUUID() + "_" + sanitizeFileName(originalFilename);
        String contentType = file.getContentType() != null ? file.getContentType() : "application/octet-stream";

        log.info("Uploading file to S3: name={}, size={} bytes, contentType={}, key={}",
                originalFilename, file.getSize(), contentType, uniqueKey);

        PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(uniqueKey)
                .contentType(contentType)
                .contentLength(file.getSize())
                .acl(ObjectCannedACL.PUBLIC_READ)
                .build();

        PutObjectResponse response = s3Client.putObject(putObjectRequest,
                RequestBody.fromInputStream(file.getInputStream(), file.getSize()));

        log.info("S3 upload successful: key={}, eTag={}", uniqueKey, response.eTag());

        return String.format("https://%s.s3.%s.amazonaws.com/%s", bucketName, awsRegion, uniqueKey);
    }

    private String sanitizeFileName(String fileName) {
        return fileName.replaceAll("[^a-zA-Z0-9._-]", "_");
    }
}
