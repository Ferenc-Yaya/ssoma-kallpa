package com.kallpa.ssoma.assets.web;

import com.kallpa.ssoma.assets.dto.ActivoDTO;
import com.kallpa.ssoma.assets.dto.CreateActivoRequest;
import com.kallpa.ssoma.assets.dto.UpdateActivoRequest;
import com.kallpa.ssoma.assets.service.ActivoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/activos")
@RequiredArgsConstructor
@CrossOrigin(origins = "${app.cors.allowed-origins}")
public class ActivoController {

    private final ActivoService activoService;

    @GetMapping
    public ResponseEntity<List<ActivoDTO>> getAllActivos() {
        log.info("GET /api/activos - Obteniendo todos los activos");
        List<ActivoDTO> activos = activoService.findAll();
        log.info("Activos encontrados: {}", activos.size());
        return ResponseEntity.ok(activos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ActivoDTO> getActivoById(@PathVariable UUID id) {
        log.info("GET /api/activos/{} - Obteniendo activo por ID", id);
        ActivoDTO activo = activoService.findById(id);
        return ResponseEntity.ok(activo);
    }

    @PostMapping
    public ResponseEntity<ActivoDTO> createActivo(@Valid @RequestBody CreateActivoRequest request) {
        log.info("POST /api/activos - Creando nuevo activo: {}", request.getCodigo());
        ActivoDTO activo = activoService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(activo);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ActivoDTO> updateActivo(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateActivoRequest request) {
        log.info("PUT /api/activos/{} - Actualizando activo", id);
        ActivoDTO activo = activoService.update(id, request);
        return ResponseEntity.ok(activo);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteActivo(@PathVariable UUID id) {
        log.info("DELETE /api/activos/{} - Eliminando activo", id);
        activoService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<ActivoDTO>> searchActivos(@RequestParam String q) {
        log.info("GET /api/activos/search?q={} - Buscando activos", q);
        List<ActivoDTO> activos = activoService.search(q);
        log.info("Activos encontrados: {}", activos.size());
        return ResponseEntity.ok(activos);
    }

    @GetMapping("/empresa/{empresaId}")
    public ResponseEntity<List<ActivoDTO>> getActivosByEmpresa(@PathVariable UUID empresaId) {
        log.info("GET /api/activos/empresa/{} - Obteniendo activos por empresa", empresaId);
        List<ActivoDTO> activos = activoService.findByEmpresaId(empresaId);
        log.info("Activos encontrados: {}", activos.size());
        return ResponseEntity.ok(activos);
    }

    @GetMapping("/tipo/{tipoActivo}")
    public ResponseEntity<List<ActivoDTO>> getActivosByTipo(@PathVariable String tipoActivo) {
        log.info("GET /api/activos/tipo/{} - Obteniendo activos por tipo", tipoActivo);
        List<ActivoDTO> activos = activoService.findByTipoActivo(tipoActivo);
        log.info("Activos encontrados: {}", activos.size());
        return ResponseEntity.ok(activos);
    }
}
