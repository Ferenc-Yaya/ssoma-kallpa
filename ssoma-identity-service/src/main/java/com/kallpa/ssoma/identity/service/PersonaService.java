package com.kallpa.ssoma.identity.service;

import com.kallpa.ssoma.identity.domain.Persona;
import com.kallpa.ssoma.identity.dto.CreatePersonaRequest;
import com.kallpa.ssoma.identity.dto.PersonaDTO;
import com.kallpa.ssoma.identity.dto.UpdatePersonaRequest;
import com.kallpa.ssoma.identity.repository.PersonaRepository;
import com.kallpa.ssoma.shared.context.TenantContext;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class PersonaService {

    private final PersonaRepository personaRepository;

    @Transactional(readOnly = true)
    public List<PersonaDTO> findAll() {
        String tenantId = TenantContext.getTenantId();
        log.debug("Buscando todas las personas para tenant: {}", tenantId);
        return personaRepository.findByTenantIdWithEmpresa(tenantId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PersonaDTO findById(UUID id) {
        String tenantId = TenantContext.getTenantId();
        log.debug("Buscando persona {} para tenant: {}", id, tenantId);
        Persona persona = personaRepository.findByTenantIdAndPersonaIdWithEmpresa(tenantId, id)
                .orElseThrow(() -> new RuntimeException("Persona no encontrada con ID: " + id));
        return toDTO(persona);
    }

    @Transactional
    public PersonaDTO create(CreatePersonaRequest request) {
        String tenantId = TenantContext.getTenantId();
        log.info("Creando nueva persona con documento: {} para tenant: {}", request.getNumeroDocumento(), tenantId);

        // Validar número de documento único
        if (personaRepository.existsByNumeroDocumento(request.getNumeroDocumento())) {
            throw new RuntimeException("Ya existe una persona con el número de documento: " + request.getNumeroDocumento());
        }

        Persona persona = new Persona();
        persona.setTenantId(tenantId);
        persona.setEmpresaId(request.getEmpresaId());
        persona.setContratoActivoId(request.getContratoActivoId());
        persona.setTipoDocumento(request.getTipoDocumento() != null ? request.getTipoDocumento() : "DNI");
        persona.setNumeroDocumento(request.getNumeroDocumento());
        persona.setNombres(request.getNombres());
        persona.setApellidos(request.getApellidos());
        persona.setFechaNacimiento(request.getFechaNacimiento());
        persona.setTelefono(request.getTelefono());
        persona.setEmail(request.getEmail());
        persona.setCargo(request.getCargo());
        persona.setEsConductor(request.getEsConductor() != null ? request.getEsConductor() : false);
        persona.setGrupoSanguineo(request.getGrupoSanguineo());
        persona.setFotoPerfilUrl(request.getFotoPerfilUrl());
        persona.setEstadoGlobal(request.getEstadoGlobal() != null ? request.getEstadoGlobal() : "ACTIVO");

        Persona savedPersona = personaRepository.save(persona);
        log.info("Persona creada exitosamente con ID: {}", savedPersona.getPersonaId());
        return toDTO(savedPersona);
    }

    @Transactional
    public PersonaDTO update(UUID id, UpdatePersonaRequest request) {
        String tenantId = TenantContext.getTenantId();
        log.info("Actualizando persona {} para tenant: {}", id, tenantId);

        Persona persona = personaRepository.findByTenantIdAndPersonaId(tenantId, id)
                .orElseThrow(() -> new RuntimeException("Persona no encontrada con ID: " + id));

        if (request.getEmpresaId() != null) {
            persona.setEmpresaId(request.getEmpresaId());
        }
        if (request.getContratoActivoId() != null) {
            persona.setContratoActivoId(request.getContratoActivoId());
        }
        if (request.getTipoDocumento() != null) {
            persona.setTipoDocumento(request.getTipoDocumento());
        }
        if (request.getNombres() != null) {
            persona.setNombres(request.getNombres());
        }
        if (request.getApellidos() != null) {
            persona.setApellidos(request.getApellidos());
        }
        if (request.getFechaNacimiento() != null) {
            persona.setFechaNacimiento(request.getFechaNacimiento());
        }
        if (request.getTelefono() != null) {
            persona.setTelefono(request.getTelefono());
        }
        if (request.getEmail() != null) {
            persona.setEmail(request.getEmail());
        }
        if (request.getCargo() != null) {
            persona.setCargo(request.getCargo());
        }
        if (request.getEsConductor() != null) {
            persona.setEsConductor(request.getEsConductor());
        }
        if (request.getGrupoSanguineo() != null) {
            persona.setGrupoSanguineo(request.getGrupoSanguineo());
        }
        if (request.getFotoPerfilUrl() != null) {
            persona.setFotoPerfilUrl(request.getFotoPerfilUrl());
        }
        if (request.getEstadoGlobal() != null) {
            persona.setEstadoGlobal(request.getEstadoGlobal());
        }

        Persona updatedPersona = personaRepository.save(persona);
        log.info("Persona actualizada exitosamente: {}", id);
        return toDTO(updatedPersona);
    }

    @Transactional
    public void delete(UUID id) {
        String tenantId = TenantContext.getTenantId();
        log.info("Eliminando persona {} para tenant: {}", id, tenantId);

        Persona persona = personaRepository.findByTenantIdAndPersonaId(tenantId, id)
                .orElseThrow(() -> new RuntimeException("Persona no encontrada con ID: " + id));

        personaRepository.delete(persona);
        log.info("Persona eliminada exitosamente: {}", id);
    }

    @Transactional(readOnly = true)
    public List<PersonaDTO> search(String searchTerm) {
        String tenantId = TenantContext.getTenantId();
        log.debug("Buscando personas con término: {} para tenant: {}", searchTerm, tenantId);
        return personaRepository.searchPersonas(tenantId, searchTerm).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PersonaDTO> findByEmpresaId(UUID empresaId) {
        String tenantId = TenantContext.getTenantId();
        log.debug("Buscando personas de la empresa {} para tenant: {}", empresaId, tenantId);
        return personaRepository.findByTenantIdAndEmpresaId(tenantId, empresaId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    private PersonaDTO toDTO(Persona persona) {
        PersonaDTO dto = new PersonaDTO();
        dto.setId(persona.getPersonaId());
        dto.setTenantId(persona.getTenantId());
        dto.setEmpresaId(persona.getEmpresaId());

        log.debug("Persona {} - empresaId: {}, empresa: {}",
            persona.getPersonaId(),
            persona.getEmpresaId(),
            persona.getEmpresa());

        if (persona.getEmpresa() != null) {
            dto.setEmpresaNombre(persona.getEmpresa().getRazonSocial());
            log.debug("Empresa asignada: {}", persona.getEmpresa().getRazonSocial());
        } else {
            log.debug("Empresa es null para persona {} (puede ser válido si no está asignada)", persona.getPersonaId());
        }

        dto.setContratoActivoId(persona.getContratoActivoId());
        dto.setTipoDocumento(persona.getTipoDocumento());
        dto.setNumeroDocumento(persona.getNumeroDocumento());
        dto.setNombres(persona.getNombres());
        dto.setApellidos(persona.getApellidos());
        dto.setNombreCompleto(persona.getNombreCompleto());
        dto.setFechaNacimiento(persona.getFechaNacimiento());
        dto.setTelefono(persona.getTelefono());
        dto.setEmail(persona.getEmail());
        dto.setCargo(persona.getCargo());
        dto.setEsConductor(persona.getEsConductor());
        dto.setGrupoSanguineo(persona.getGrupoSanguineo());
        dto.setFotoPerfilUrl(persona.getFotoPerfilUrl());
        dto.setEstadoGlobal(persona.getEstadoGlobal());
        dto.setCreatedAt(persona.getCreatedAt());

        return dto;
    }
}
