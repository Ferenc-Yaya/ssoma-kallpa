package com.kallpa.ssoma.identity.service.storage;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class LocalFileStorageService implements FileStorageService{

    @Value("${storage.local.base-path:/data/uploads}")
    private String basePath;

    @Value("${storage.local.base-url:http://localhost:8081}")
    private String baseUrl;

    /**
     * CREAR archivo
     */
    public String save(MultipartFile file, String folder) {
        try {
            Path folderPath = Paths.get(basePath, folder);
            Files.createDirectories(folderPath);

            String original = file.getOriginalFilename();
            String extension = "";

            if (original != null && original.contains(".")) {
                extension = original.substring(original.lastIndexOf("."));
            }

            String filename = UUID.randomUUID() + extension;
            Path filePath = folderPath.resolve(filename);

            Files.copy(file.getInputStream(), filePath);

            return baseUrl + "/uploads/" + folder + "/" + filename;

        } catch (Exception e) {
            throw new RuntimeException("Error guardando archivo", e);
        }
    }

    /**
     * BORRAR archivo
     */
    public void delete(String fileUrl) {
        try {
            if (fileUrl == null || fileUrl.isBlank()) return;

            String relativePath = fileUrl.replace(baseUrl + "/uploads/", "");
            Path path = Paths.get(basePath, relativePath);

            Files.deleteIfExists(path);

        } catch (Exception e) {
            throw new RuntimeException("Error eliminando archivo", e);
        }
    }
}
