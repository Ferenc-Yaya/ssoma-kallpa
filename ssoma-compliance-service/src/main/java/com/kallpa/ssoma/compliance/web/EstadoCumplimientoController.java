package com.kallpa.ssoma.compliance.web;

import com.kallpa.ssoma.compliance.dto.CreateEstadoCumplimientoRequest;
import com.kallpa.ssoma.compliance.dto.EstadoCumplimientoDTO;
import com.kallpa.ssoma.compliance.dto.UpdateEstadoCumplimientoRequest;
import com.kallpa.ssoma.compliance.service.EstadoCumplimientoService;
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
@RequestMapping("/api/estados-cumplimiento")
@RequiredArgsConstructor
public class EstadoCumplimientoController {

    private final EstadoCumplimientoService service;

    @GetMapping
    public ResponseEntity<List<EstadoCumplimientoDTO>> findAll() {
        log.debug("REST request to get all EstadosCumplimiento");
        return ResponseEntity.ok(service.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EstadoCumplimientoDTO> findById(@PathVariable UUID id) {
        log.debug("REST request to get EstadoCumplimiento : {}", id);
        return ResponseEntity.ok(service.findById(id));
    }

    @GetMapping("/entidad/{entidadId}/{tipoEntidad}")
    public ResponseEntity<EstadoCumplimientoDTO> findByEntidad(
            @PathVariable UUID entidadId,
            @PathVariable String tipoEntidad) {
        log.debug("REST request to get EstadoCumplimiento by entidad : {} {}", entidadId, tipoEntidad);
        EstadoCumplimientoDTO result = service.findByEntidad(entidadId, tipoEntidad);
        if (result == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(result);
    }

    @GetMapping("/tipo-entidad/{tipoEntidad}")
    public ResponseEntity<List<EstadoCumplimientoDTO>> findByTipoEntidad(@PathVariable String tipoEntidad) {
        log.debug("REST request to get EstadosCumplimiento by tipoEntidad : {}", tipoEntidad);
        return ResponseEntity.ok(service.findByTipoEntidad(tipoEntidad));
    }

    @GetMapping("/no-aptos")
    public ResponseEntity<List<EstadoCumplimientoDTO>> findNoAptos() {
        log.debug("REST request to get EstadosCumplimiento no aptos");
        return ResponseEntity.ok(service.findNoAptos());
    }

    @GetMapping("/con-alertas")
    public ResponseEntity<List<EstadoCumplimientoDTO>> findConAlertas() {
        log.debug("REST request to get EstadosCumplimiento con alertas");
        return ResponseEntity.ok(service.findConAlertas());
    }

    @PostMapping
    public ResponseEntity<EstadoCumplimientoDTO> create(
            @Valid @RequestBody CreateEstadoCumplimientoRequest request) {
        log.debug("REST request to create EstadoCumplimiento : {}", request);
        EstadoCumplimientoDTO result = service.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }

    @PutMapping("/{id}")
    public ResponseEntity<EstadoCumplimientoDTO> update(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateEstadoCumplimientoRequest request) {
        log.debug("REST request to update EstadoCumplimiento : {}", id);
        return ResponseEntity.ok(service.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        log.debug("REST request to delete EstadoCumplimiento : {}", id);
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
