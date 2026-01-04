package com.kallpa.ssoma.identity.web;

import com.kallpa.ssoma.identity.dto.request.CreatePersonaRequest;
import com.kallpa.ssoma.identity.dto.PersonaDTO;
import com.kallpa.ssoma.identity.dto.request.UpdatePersonaRequest;
import com.kallpa.ssoma.identity.service.PersonaService;
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
@RequestMapping("/api/personas")
@RequiredArgsConstructor
@CrossOrigin(origins = "${app.cors.allowed-origins}")
public class PersonaController {

    private final PersonaService personaService;

    @GetMapping
    public ResponseEntity<List<PersonaDTO>> getAllPersonas() {
        log.info("GET /api/personas - Obteniendo todas las personas");
        List<PersonaDTO> personas = personaService.findAll();
        log.info("Personas encontradas: {}", personas.size());
        return ResponseEntity.ok(personas);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PersonaDTO> getPersonaById(@PathVariable UUID id) {
        log.info("GET /api/personas/{} - Obteniendo persona por ID", id);
        PersonaDTO persona = personaService.findById(id);
        return ResponseEntity.ok(persona);
    }

    @PostMapping
    public ResponseEntity<PersonaDTO> createPersona(@Valid @RequestBody CreatePersonaRequest request) {
        log.info("POST /api/personas - Creando nueva persona: {}", request.getNumeroDocumento());
        PersonaDTO persona = personaService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(persona);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PersonaDTO> updatePersona(
            @PathVariable UUID id,
            @Valid @RequestBody UpdatePersonaRequest request) {
        log.info("PUT /api/personas/{} - Actualizando persona", id);
        PersonaDTO persona = personaService.update(id, request);
        return ResponseEntity.ok(persona);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePersona(@PathVariable UUID id) {
        log.info("DELETE /api/personas/{} - Eliminando persona", id);
        personaService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<PersonaDTO>> searchPersonas(@RequestParam String q) {
        log.info("GET /api/personas/search?q={} - Buscando personas", q);
        List<PersonaDTO> personas = personaService.search(q);
        log.info("Personas encontradas: {}", personas.size());
        return ResponseEntity.ok(personas);
    }

    @GetMapping("/empresa/{empresaId}")
    public ResponseEntity<List<PersonaDTO>> getPersonasByEmpresa(@PathVariable UUID empresaId) {
        log.info("GET /api/personas/empresa/{} - Obteniendo personas por empresa", empresaId);
        List<PersonaDTO> personas = personaService.findByEmpresaId(empresaId);
        log.info("Personas encontradas: {}", personas.size());
        return ResponseEntity.ok(personas);
    }
}
