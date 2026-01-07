package com.kallpa.ssoma.identity.web;

import com.kallpa.ssoma.identity.dto.request.CreateEmpresaRequest;
import com.kallpa.ssoma.identity.dto.EmpresaDTO;
import com.kallpa.ssoma.identity.dto.request.UpdateEmpresaRequest;
import com.kallpa.ssoma.identity.service.EmpresaService;
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
@RequestMapping("/api/empresas")
@RequiredArgsConstructor
@CrossOrigin(origins = "${app.cors.allowed-origins}")
public class EmpresaController {

    private final EmpresaService empresaService;

    @GetMapping
    public ResponseEntity<List<EmpresaDTO>> getAllEmpresas(
            @RequestParam(required = false) String tenant
    ) {
        log.info("GET /api/empresas - Solicitud recibida. Filtro tenant: {}", tenant);
        List<EmpresaDTO> empresas = empresaService.findAll(tenant);

        return ResponseEntity.ok(empresas);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EmpresaDTO> getEmpresaById(@PathVariable UUID id) {
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
            @PathVariable UUID id,
            @Valid @RequestBody UpdateEmpresaRequest request) {
        log.info("PUT /api/empresas/{} - Actualizando empresa", id);
        EmpresaDTO empresa = empresaService.update(id, request);
        return ResponseEntity.ok(empresa);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEmpresa(@PathVariable UUID id) {
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