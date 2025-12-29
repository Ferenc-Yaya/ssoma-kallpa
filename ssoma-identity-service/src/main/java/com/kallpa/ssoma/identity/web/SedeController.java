package com.kallpa.ssoma.identity.web;

import com.kallpa.ssoma.identity.dto.SedeDTO;
import com.kallpa.ssoma.identity.service.SedeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/sedes")
@RequiredArgsConstructor
@CrossOrigin(origins = "${app.cors.allowed-origins}")
public class SedeController {

    private final SedeService sedeService;

    @GetMapping("/empresa/{empresaId}")
    public ResponseEntity<List<SedeDTO>> getSedesByEmpresa(@PathVariable UUID empresaId) {
        log.info("GET /api/sedes/empresa/{} - Obteniendo sedes de empresa", empresaId);
        List<SedeDTO> sedes = sedeService.findByEmpresaId(empresaId);
        return ResponseEntity.ok(sedes);
    }

    @GetMapping("/empresa/{empresaId}/count")
    public ResponseEntity<Long> countSedesByEmpresa(@PathVariable UUID empresaId) {
        log.info("GET /api/sedes/empresa/{}/count - Contando sedes de empresa", empresaId);
        long count = sedeService.countByEmpresaId(empresaId);
        return ResponseEntity.ok(count);
    }
}
