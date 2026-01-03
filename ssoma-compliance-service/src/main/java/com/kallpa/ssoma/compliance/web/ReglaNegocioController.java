package com.kallpa.ssoma.compliance.web;

import com.kallpa.ssoma.compliance.dto.CreateReglaNegocioRequest;
import com.kallpa.ssoma.compliance.dto.ReglaNegocioDTO;
import com.kallpa.ssoma.compliance.dto.UpdateReglaNegocioRequest;
import com.kallpa.ssoma.compliance.service.ReglaNegocioService;
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
@RequestMapping("/api/reglas")
@RequiredArgsConstructor
public class ReglaNegocioController {

    private final ReglaNegocioService reglaNegocioService;

    @GetMapping
    public ResponseEntity<List<ReglaNegocioDTO>> findAll() {
        log.debug("REST request to get all ReglasNegocio");
        return ResponseEntity.ok(reglaNegocioService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReglaNegocioDTO> findById(@PathVariable UUID id) {
        log.debug("REST request to get ReglaNegocio : {}", id);
        return ResponseEntity.ok(reglaNegocioService.findById(id));
    }

    @GetMapping("/categoria/{categoria}")
    public ResponseEntity<List<ReglaNegocioDTO>> findByCategoria(@PathVariable String categoria) {
        log.debug("REST request to get ReglasNegocio by categoria : {}", categoria);
        return ResponseEntity.ok(reglaNegocioService.findByCategoria(categoria));
    }

    @GetMapping("/activas")
    public ResponseEntity<List<ReglaNegocioDTO>> findActivas() {
        log.debug("REST request to get active ReglasNegocio");
        return ResponseEntity.ok(reglaNegocioService.findActivas());
    }

    @PostMapping
    public ResponseEntity<ReglaNegocioDTO> create(@Valid @RequestBody CreateReglaNegocioRequest request) {
        log.debug("REST request to create ReglaNegocio : {}", request);
        ReglaNegocioDTO result = reglaNegocioService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ReglaNegocioDTO> update(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateReglaNegocioRequest request) {
        log.debug("REST request to update ReglaNegocio : {}", id);
        return ResponseEntity.ok(reglaNegocioService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        log.debug("REST request to delete ReglaNegocio : {}", id);
        reglaNegocioService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
