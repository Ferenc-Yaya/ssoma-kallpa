package com.kallpa.ssoma.documental.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.net.URI;
import java.util.UUID;

@Service
public class DigitalOceanStorageService {

    private final S3Client s3Client;

    @Value("${do.spaces.bucket}")
    private String bucketName;

    @Value("${do.spaces.endpoint}")
    private String endpoint; // https://nyc3.digitaloceanspaces.com

    public DigitalOceanStorageService(
            @Value("${do.key}") String key,
            @Value("${do.secret}") String secret,
            @Value("${do.region}") String region,
            @Value("${do.spaces.endpoint}") String endpoint) {

        this.endpoint = endpoint;
        this.s3Client = S3Client.builder()
                .endpointOverride(URI.create(endpoint))
                .region(software.amazon.awssdk.regions.Region.of(region))
                .credentialsProvider(StaticCredentialsProvider.create(
                        AwsBasicCredentials.create(key, secret)))
                .build();
    }

    public String subirArchivo(byte[] datos, String nombreArchivo, String tenantId) {
        String rutaArchivo = tenantId + "/" + UUID.randomUUID() + "_" + nombreArchivo;

        s3Client.putObject(
                PutObjectRequest.builder()
                        .bucket(bucketName)
                        .key(rutaArchivo)
                        .acl("public-read")
                        .build(),
                RequestBody.fromBytes(datos)
        );

        return endpoint + "/" + bucketName + "/" + rutaArchivo;
    }
}