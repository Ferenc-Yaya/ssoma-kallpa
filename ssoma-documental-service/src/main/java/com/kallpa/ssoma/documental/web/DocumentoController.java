package com.kallpa.ssoma.documental.web;

import com.kallpa.ssoma.documental.dto.CreateDocumentoRequest;
import com.kallpa.ssoma.documental.dto.DocumentoDTO;
import com.kallpa.ssoma.documental.dto.UpdateDocumentoRequest;
import com.kallpa.ssoma.documental.service.DocumentoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/documentos")
@RequiredArgsConstructor
@CrossOrigin(origins = "${app.cors.allowed-origins}")
public class DocumentoController {

    private final DocumentoService documentoService;

    @GetMapping
    public ResponseEntity<List<DocumentoDTO>> getAllDocumentos() {
        log.info("GET /api/documentos - Obteniendo todos los documentos");
        List<DocumentoDTO> documentos = documentoService.findAll();
        log.info("Documentos encontrados: {}", documentos.size());
        return ResponseEntity.ok(documentos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DocumentoDTO> getDocumentoById(@PathVariable Long id) {
        log.info("GET /api/documentos/{} - Obteniendo documento por ID", id);
        DocumentoDTO documento = documentoService.findById(id);
        return ResponseEntity.ok(documento);
    }

    @PostMapping
    public ResponseEntity<DocumentoDTO> createDocumento(@Valid @RequestBody CreateDocumentoRequest request) {
        log.info("POST /api/documentos - Creando nuevo documento: {}", request.getNombreArchivo());
        DocumentoDTO documento = documentoService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(documento);
    }

    @PutMapping("/{id}")
    public ResponseEntity<DocumentoDTO> updateDocumento(
            @PathVariable Long id,
            @Valid @RequestBody UpdateDocumentoRequest request) {
        log.info("PUT /api/documentos/{} - Actualizando documento", id);
        DocumentoDTO documento = documentoService.update(id, request);
        return ResponseEntity.ok(documento);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDocumento(@PathVariable Long id) {
        log.info("DELETE /api/documentos/{} - Eliminando documento", id);
        documentoService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<DocumentoDTO>> searchDocumentos(@RequestParam String q) {
        log.info("GET /api/documentos/search?q={} - Buscando documentos", q);
        List<DocumentoDTO> documentos = documentoService.search(q);
        log.info("Documentos encontrados: {}", documentos.size());
        return ResponseEntity.ok(documentos);
    }

    @GetMapping("/entidad/{entidadTipo}/{entidadId}")
    public ResponseEntity<List<DocumentoDTO>> getDocumentosByEntidad(
            @PathVariable String entidadTipo,
            @PathVariable Long entidadId) {
        log.info("GET /api/documentos/entidad/{}/{} - Obteniendo documentos por entidad", entidadTipo, entidadId);
        List<DocumentoDTO> documentos = documentoService.findByEntidad(entidadTipo, entidadId);
        log.info("Documentos encontrados: {}", documentos.size());
        return ResponseEntity.ok(documentos);
    }

    @GetMapping("/estado/{estado}")
    public ResponseEntity<List<DocumentoDTO>> getDocumentosByEstado(@PathVariable String estado) {
        log.info("GET /api/documentos/estado/{} - Obteniendo documentos por estado", estado);
        List<DocumentoDTO> documentos = documentoService.findByEstado(estado);
        log.info("Documentos encontrados: {}", documentos.size());
        return ResponseEntity.ok(documentos);
    }

    @GetMapping("/proximos-vencer")
    public ResponseEntity<List<DocumentoDTO>> getDocumentosProximosVencer(
            @RequestParam(defaultValue = "30") int dias) {
        log.info("GET /api/documentos/proximos-vencer?dias={} - Obteniendo documentos próximos a vencer", dias);
        List<DocumentoDTO> documentos = documentoService.findProximosAVencer(dias);
        log.info("Documentos encontrados: {}", documentos.size());
        return ResponseEntity.ok(documentos);
    }
}
