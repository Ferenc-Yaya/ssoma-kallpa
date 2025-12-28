package com.kallpa.ssoma.hazmat.web;

import com.kallpa.ssoma.hazmat.dto.CreateSustanciaRequest;
import com.kallpa.ssoma.hazmat.dto.SustanciaPeligrosaDTO;
import com.kallpa.ssoma.hazmat.dto.UpdateSustanciaRequest;
import com.kallpa.ssoma.hazmat.service.SustanciaPeligrosaService;
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
@RequestMapping("/api/sustancias-peligrosas")
@RequiredArgsConstructor
@CrossOrigin(origins = "${app.cors.allowed-origins}")
public class SustanciaPeligrosaController {

    private final SustanciaPeligrosaService sustanciaService;

    @GetMapping
    public ResponseEntity<List<SustanciaPeligrosaDTO>> getAllSustancias() {
        log.info("GET /api/sustancias-peligrosas - Obteniendo todas las sustancias peligrosas");
        List<SustanciaPeligrosaDTO> sustancias = sustanciaService.findAll();
        log.info("Sustancias peligrosas encontradas: {}", sustancias.size());
        return ResponseEntity.ok(sustancias);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SustanciaPeligrosaDTO> getSustanciaById(@PathVariable UUID id) {
        log.info("GET /api/sustancias-peligrosas/{} - Obteniendo sustancia por ID", id);
        SustanciaPeligrosaDTO sustancia = sustanciaService.findById(id);
        return ResponseEntity.ok(sustancia);
    }

    @PostMapping
    public ResponseEntity<SustanciaPeligrosaDTO> createSustancia(@Valid @RequestBody CreateSustanciaRequest request) {
        log.info("POST /api/sustancias-peligrosas - Creando nueva sustancia: {}", request.getNombre());
        SustanciaPeligrosaDTO sustancia = sustanciaService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(sustancia);
    }

    @PutMapping("/{id}")
    public ResponseEntity<SustanciaPeligrosaDTO> updateSustancia(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateSustanciaRequest request) {
        log.info("PUT /api/sustancias-peligrosas/{} - Actualizando sustancia", id);
        SustanciaPeligrosaDTO sustancia = sustanciaService.update(id, request);
        return ResponseEntity.ok(sustancia);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSustancia(@PathVariable UUID id) {
        log.info("DELETE /api/sustancias-peligrosas/{} - Eliminando sustancia", id);
        sustanciaService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<SustanciaPeligrosaDTO>> searchSustancias(@RequestParam String q) {
        log.info("GET /api/sustancias-peligrosas/search?q={} - Buscando sustancias", q);
        List<SustanciaPeligrosaDTO> sustancias = sustanciaService.search(q);
        log.info("Sustancias encontradas: {}", sustancias.size());
        return ResponseEntity.ok(sustancias);
    }

    @GetMapping("/clase/{clasePeligro}")
    public ResponseEntity<List<SustanciaPeligrosaDTO>> getSustanciasByClase(@PathVariable String clasePeligro) {
        log.info("GET /api/sustancias-peligrosas/clase/{} - Obteniendo sustancias por clase", clasePeligro);
        List<SustanciaPeligrosaDTO> sustancias = sustanciaService.findByClasePeligro(clasePeligro);
        log.info("Sustancias encontradas: {}", sustancias.size());
        return ResponseEntity.ok(sustancias);
    }
}
