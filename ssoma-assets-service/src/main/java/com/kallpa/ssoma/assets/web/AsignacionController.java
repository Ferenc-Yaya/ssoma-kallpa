package com.kallpa.ssoma.assets.web;

import com.kallpa.ssoma.assets.dto.AsignacionDTO;
import com.kallpa.ssoma.assets.dto.CreateAsignacionRequest;
import com.kallpa.ssoma.assets.dto.UpdateAsignacionRequest;
import com.kallpa.ssoma.assets.service.AsignacionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/asignaciones")
@RequiredArgsConstructor
public class AsignacionController {

    private final AsignacionService asignacionService;

    @GetMapping
    public ResponseEntity<List<AsignacionDTO>> getAll() {
        return ResponseEntity.ok(asignacionService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AsignacionDTO> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(asignacionService.findById(id));
    }

    @PostMapping
    public ResponseEntity<AsignacionDTO> create(@Valid @RequestBody CreateAsignacionRequest request) {
        AsignacionDTO created = asignacionService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AsignacionDTO> update(@PathVariable UUID id, @Valid @RequestBody UpdateAsignacionRequest request) {
        return ResponseEntity.ok(asignacionService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        asignacionService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/activo/{activoId}")
    public ResponseEntity<List<AsignacionDTO>> getByActivoId(@PathVariable UUID activoId) {
        return ResponseEntity.ok(asignacionService.findByActivoId(activoId));
    }

    @GetMapping("/persona/{personaId}")
    public ResponseEntity<List<AsignacionDTO>> getByPersonaId(@PathVariable UUID personaId) {
        return ResponseEntity.ok(asignacionService.findByPersonaId(personaId));
    }
}
