package com.kallpa.ssoma.identity.web;

import com.kallpa.ssoma.identity.service.storage.FileStorageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import jakarta.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;

@Slf4j
@RestController
@RequiredArgsConstructor
public class FileController {

    private final FileStorageService storageService;

    @Value("${storage.local.base-path:/data/uploads}")
    private String basePath;

    @PostMapping("/api/files/upload")
    public Map<String, String> upload(@RequestParam MultipartFile file) {
        return Map.of(
                "url", storageService.save(file, "logos")
        );
    }

    @DeleteMapping("/api/files")
    public void delete(@RequestParam String url) {
        storageService.delete(url);
    }

    @GetMapping("/uploads/**")
    public ResponseEntity<Resource> serveFile(HttpServletRequest request) throws IOException {
        // Extraer la ruta del archivo desde la URL
        String requestUri = request.getRequestURI();
        String filePath = requestUri.replace("/uploads/", "");

        log.info("Sirviendo archivo: {}", filePath);

        // Construir ruta absoluta
        Path path = Paths.get(basePath, filePath).normalize();

        // Verificar que el archivo existe
        if (!Files.exists(path) || !Files.isRegularFile(path)) {
            log.warn("Archivo no encontrado: {}", path);
            return ResponseEntity.notFound().build();
        }

        // Crear recurso
        Resource resource = new FileSystemResource(path);

        // Determinar tipo de contenido
        String contentType = Files.probeContentType(path);
        if (contentType == null) {
            contentType = "application/octet-stream";
        }

        log.info("Archivo encontrado: {} ({})", path, contentType);

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + path.getFileName() + "\"")
                .body(resource);
    }
}



