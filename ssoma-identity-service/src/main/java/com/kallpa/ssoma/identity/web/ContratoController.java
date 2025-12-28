package com.kallpa.ssoma.identity.web;

import com.kallpa.ssoma.identity.dto.ContratoDTO;
import com.kallpa.ssoma.identity.dto.CreateContratoRequest;
import com.kallpa.ssoma.identity.dto.UpdateContratoRequest;
import com.kallpa.ssoma.identity.service.ContratoService;
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
@RequestMapping("/api/contratos")
@RequiredArgsConstructor
@CrossOrigin(origins = "${app.cors.allowed-origins}")
public class ContratoController {

    private final ContratoService contratoService;

    @GetMapping
    public ResponseEntity<List<ContratoDTO>> getAllContratos() {
        log.info("GET /api/contratos - Obteniendo todos los contratos");
        List<ContratoDTO> contratos = contratoService.findAll();
        log.info("Contratos encontrados: {}", contratos.size());
        return ResponseEntity.ok(contratos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ContratoDTO> getContratoById(@PathVariable UUID id) {
        log.info("GET /api/contratos/{} - Obteniendo contrato por ID", id);
        ContratoDTO contrato = contratoService.findById(id);
        return ResponseEntity.ok(contrato);
    }

    @PostMapping
    public ResponseEntity<ContratoDTO> createContrato(@Valid @RequestBody CreateContratoRequest request) {
        log.info("POST /api/contratos - Creando nuevo contrato: {}", request.getNumeroContrato());
        ContratoDTO contrato = contratoService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(contrato);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ContratoDTO> updateContrato(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateContratoRequest request) {
        log.info("PUT /api/contratos/{} - Actualizando contrato", id);
        ContratoDTO contrato = contratoService.update(id, request);
        return ResponseEntity.ok(contrato);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteContrato(@PathVariable UUID id) {
        log.info("DELETE /api/contratos/{} - Eliminando contrato", id);
        contratoService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<ContratoDTO>> searchContratos(@RequestParam String q) {
        log.info("GET /api/contratos/search?q={} - Buscando contratos", q);
        List<ContratoDTO> contratos = contratoService.search(q);
        log.info("Contratos encontrados: {}", contratos.size());
        return ResponseEntity.ok(contratos);
    }

    @GetMapping("/empresa/{empresaId}")
    public ResponseEntity<List<ContratoDTO>> getContratosByEmpresa(@PathVariable UUID empresaId) {
        log.info("GET /api/contratos/empresa/{} - Obteniendo contratos por empresa", empresaId);
        List<ContratoDTO> contratos = contratoService.findByEmpresaId(empresaId);
        log.info("Contratos encontrados: {}", contratos.size());
        return ResponseEntity.ok(contratos);
    }
}
