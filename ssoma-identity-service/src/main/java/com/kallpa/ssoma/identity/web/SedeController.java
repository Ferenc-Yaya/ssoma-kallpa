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

    // ---------------- Read ----------------
    @GetMapping("/empresa/{empresaId}")
    public ResponseEntity<List<SedeDTO>> getSedesByEmpresa(@PathVariable UUID empresaId) {
        return ResponseEntity.ok(sedeService.findByEmpresaId(empresaId));
    }

    @GetMapping("/empresa/{empresaId}/count")
    public ResponseEntity<Long> countSedesByEmpresa(@PathVariable UUID empresaId) {
        return ResponseEntity.ok(sedeService.countByEmpresaId(empresaId));
    }

    // ---------------- Create ----------------
    @PostMapping
    public ResponseEntity<SedeDTO> createSede(@RequestBody SedeDTO dto) {
        return ResponseEntity.ok(sedeService.createSede(dto));
    }

    // ---------------- Update ----------------
    @PutMapping("/{id}")
    public ResponseEntity<SedeDTO> updateSede(@PathVariable UUID id, @RequestBody SedeDTO dto) {
        return ResponseEntity.ok(sedeService.updateSede(id, dto));
    }

    // ---------------- Delete ----------------
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSede(@PathVariable UUID id) {
        sedeService.deleteSede(id);
        return ResponseEntity.noContent().build();
    }
}
