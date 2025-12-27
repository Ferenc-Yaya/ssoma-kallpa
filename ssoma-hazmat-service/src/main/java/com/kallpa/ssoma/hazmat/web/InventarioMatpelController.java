package com.kallpa.ssoma.hazmat.web;

import com.kallpa.ssoma.hazmat.dto.CreateInventarioRequest;
import com.kallpa.ssoma.hazmat.dto.InventarioMatpelDTO;
import com.kallpa.ssoma.hazmat.dto.UpdateInventarioRequest;
import com.kallpa.ssoma.hazmat.service.InventarioMatpelService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/inventario-matpel")
@RequiredArgsConstructor
@CrossOrigin(origins = "${app.cors.allowed-origins}")
public class InventarioMatpelController {

    private final InventarioMatpelService inventarioService;

    @GetMapping
    public ResponseEntity<List<InventarioMatpelDTO>> getAllInventarios() {
        log.info("GET /api/inventario-matpel - Obteniendo todo el inventario");
        List<InventarioMatpelDTO> inventarios = inventarioService.findAll();
        log.info("Inventarios encontrados: {}", inventarios.size());
        return ResponseEntity.ok(inventarios);
    }

    @GetMapping("/{id}")
    public ResponseEntity<InventarioMatpelDTO> getInventarioById(@PathVariable Long id) {
        log.info("GET /api/inventario-matpel/{} - Obteniendo inventario por ID", id);
        InventarioMatpelDTO inventario = inventarioService.findById(id);
        return ResponseEntity.ok(inventario);
    }

    @GetMapping("/empresa/{empresaId}")
    public ResponseEntity<List<InventarioMatpelDTO>> getInventariosByEmpresa(@PathVariable Long empresaId) {
        log.info("GET /api/inventario-matpel/empresa/{} - Obteniendo inventario por empresa", empresaId);
        List<InventarioMatpelDTO> inventarios = inventarioService.findByEmpresaId(empresaId);
        log.info("Inventarios encontrados: {}", inventarios.size());
        return ResponseEntity.ok(inventarios);
    }

    @PostMapping
    public ResponseEntity<InventarioMatpelDTO> createInventario(@Valid @RequestBody CreateInventarioRequest request) {
        log.info("POST /api/inventario-matpel - Creando nuevo inventario");
        InventarioMatpelDTO inventario = inventarioService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(inventario);
    }

    @PutMapping("/{id}")
    public ResponseEntity<InventarioMatpelDTO> updateInventario(
            @PathVariable Long id,
            @Valid @RequestBody UpdateInventarioRequest request) {
        log.info("PUT /api/inventario-matpel/{} - Actualizando inventario", id);
        InventarioMatpelDTO inventario = inventarioService.update(id, request);
        return ResponseEntity.ok(inventario);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInventario(@PathVariable Long id) {
        log.info("DELETE /api/inventario-matpel/{} - Eliminando inventario", id);
        inventarioService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<InventarioMatpelDTO>> searchInventarios(@RequestParam String q) {
        log.info("GET /api/inventario-matpel/search?q={} - Buscando inventarios", q);
        List<InventarioMatpelDTO> inventarios = inventarioService.search(q);
        log.info("Inventarios encontrados: {}", inventarios.size());
        return ResponseEntity.ok(inventarios);
    }

    @GetMapping("/estado/{estado}")
    public ResponseEntity<List<InventarioMatpelDTO>> getInventariosByEstado(@PathVariable String estado) {
        log.info("GET /api/inventario-matpel/estado/{} - Obteniendo inventarios por estado", estado);
        List<InventarioMatpelDTO> inventarios = inventarioService.findByEstado(estado);
        log.info("Inventarios encontrados: {}", inventarios.size());
        return ResponseEntity.ok(inventarios);
    }
}
