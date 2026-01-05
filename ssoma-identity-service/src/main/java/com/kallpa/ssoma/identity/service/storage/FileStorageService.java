package com.kallpa.ssoma.identity.service.storage;

import org.springframework.web.multipart.MultipartFile;

public interface FileStorageService {

    /**
     * CREAR archivo
     */
    String save(MultipartFile file, String folder);

    /**
     * BORRAR archivo
     */
    void delete(String fileUrl);
}
