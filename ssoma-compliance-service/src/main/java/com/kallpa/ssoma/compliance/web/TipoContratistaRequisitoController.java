package com.kallpa.ssoma.compliance.web;

import com.kallpa.ssoma.compliance.dto.CreateTipoContratistaRequisitoRequest;
import com.kallpa.ssoma.compliance.dto.TipoContratistaRequisitoDTO;
import com.kallpa.ssoma.compliance.dto.UpdateTipoContratistaRequisitoRequest;
import com.kallpa.ssoma.compliance.service.TipoContratistaRequisitoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/tipo-contratista-requisitos")
@RequiredArgsConstructor
public class TipoContratistaRequisitoController {

    private final TipoContratistaRequisitoService service;

    @GetMapping
    public ResponseEntity<List<TipoContratistaRequisitoDTO>> findAll() {
        log.debug("REST request to get all TipoContratistaRequisitos");
        return ResponseEntity.ok(service.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TipoContratistaRequisitoDTO> findById(@PathVariable UUID id) {
        log.debug("REST request to get TipoContratistaRequisito : {}", id);
        return ResponseEntity.ok(service.findById(id));
    }

    @GetMapping("/tipo-contratista/{tipoContratistaId}")
    public ResponseEntity<List<TipoContratistaRequisitoDTO>> findByTipoContratista(
            @PathVariable UUID tipoContratistaId) {
        log.debug("REST request to get TipoContratistaRequisitos by tipoContratista : {}", tipoContratistaId);
        return ResponseEntity.ok(service.findByTipoContratista(tipoContratistaId));
    }

    @PostMapping
    public ResponseEntity<TipoContratistaRequisitoDTO> create(
            @Valid @RequestBody CreateTipoContratistaRequisitoRequest request) {
        log.debug("REST request to create TipoContratistaRequisito : {}", request);
        TipoContratistaRequisitoDTO result = service.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TipoContratistaRequisitoDTO> update(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateTipoContratistaRequisitoRequest request) {
        log.debug("REST request to update TipoContratistaRequisito : {}", id);
        return ResponseEntity.ok(service.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        log.debug("REST request to delete TipoContratistaRequisito : {}", id);
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
