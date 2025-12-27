package com.kallpa.ssoma.identity.controller;

import com.kallpa.ssoma.identity.dto.CreateEmpresaRequest;
import com.kallpa.ssoma.identity.dto.EmpresaDTO;
import com.kallpa.ssoma.identity.dto.UpdateEmpresaRequest;
import com.kallpa.ssoma.identity.service.EmpresaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/empresas")
@RequiredArgsConstructor
@CrossOrigin(origins = "${app.cors.allowed-origins}")
public class EmpresaController {

    private final EmpresaService empresaService;

    @GetMapping
    public ResponseEntity<List<EmpresaDTO>> getAllEmpresas() {
        log.info("GET /api/empresas - Obteniendo todas las empresas");
        List<EmpresaDTO> empresas = empresaService.findAll();
        return ResponseEntity.ok(empresas);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EmpresaDTO> getEmpresaById(@PathVariable Long id) {
        log.info("GET /api/empresas/{} - Obteniendo empresa por ID", id);
        EmpresaDTO empresa = empresaService.findById(id);
        return ResponseEntity.ok(empresa);
    }

    @PostMapping
    public ResponseEntity<EmpresaDTO> createEmpresa(@Valid @RequestBody CreateEmpresaRequest request) {
        log.info("POST /api/empresas - Creando nueva empresa");
        EmpresaDTO empresa = empresaService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(empresa);
    }

    @PutMapping("/{id}")
    public ResponseEntity<EmpresaDTO> updateEmpresa(
            @PathVariable Long id,
            @Valid @RequestBody UpdateEmpresaRequest request) {
        log.info("PUT /api/empresas/{} - Actualizando empresa", id);
        EmpresaDTO empresa = empresaService.update(id, request);
        return ResponseEntity.ok(empresa);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEmpresa(@PathVariable Long id) {
        log.info("DELETE /api/empresas/{} - Eliminando empresa", id);
        empresaService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<EmpresaDTO>> searchEmpresas(@RequestParam String q) {
        log.info("GET /api/empresas/search?q={} - Buscando empresas", q);
        List<EmpresaDTO> empresas = empresaService.search(q);
        return ResponseEntity.ok(empresas);
    }
}
