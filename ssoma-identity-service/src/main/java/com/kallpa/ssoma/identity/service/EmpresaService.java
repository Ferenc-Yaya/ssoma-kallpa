package com.kallpa.ssoma.identity.service;

import com.kallpa.ssoma.identity.domain.Empresa;
import com.kallpa.ssoma.identity.domain.EmpresaContacto;
import com.kallpa.ssoma.identity.dto.CreateEmpresaRequest;
import com.kallpa.ssoma.identity.dto.EmpresaContactoDTO;
import com.kallpa.ssoma.identity.dto.EmpresaDTO;
import com.kallpa.ssoma.identity.dto.UpdateEmpresaRequest;
import com.kallpa.ssoma.identity.repository.EmpresaRepository;
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
public class EmpresaService {

    private final EmpresaRepository empresaRepository;

    @Transactional(readOnly = true)
    public List<EmpresaDTO> findAll() {
        String tenantId = TenantContext.getTenantId();
        log.debug("Buscando todas las empresas para tenant: {}", tenantId);

        // SUPER_ADMIN (tenant SYSTEM) puede ver empresas de todos los tenants
        if ("SYSTEM".equals(tenantId)) {
            log.info("SUPER_ADMIN: Buscando empresas de TODOS los tenants");
            List<Empresa> empresas = empresaRepository.findAllWithTipo();
            log.info("🔍 Empresas encontradas en BD: {}", empresas.size());
            empresas.forEach(e -> log.info("  - Empresa: {} ({})", e.getRazonSocial(), e.getTenantId()));

            List<EmpresaDTO> dtos = empresas.stream()
                    .map(this::toDTO)
                    .collect(Collectors.toList());
            log.info("📦 DTOs generados: {}", dtos.size());
            return dtos;
        }

        return empresaRepository.findByTenantIdWithTipo(tenantId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public EmpresaDTO findById(UUID id) {
        String tenantId = TenantContext.getTenantId();
        log.debug("Buscando empresa {} para tenant: {}", id, tenantId);
        Empresa empresa = empresaRepository.findByTenantIdAndEmpresaIdWithTipo(tenantId, id)
                .orElseThrow(() -> new RuntimeException("Empresa no encontrada con ID: " + id));
        return toDTO(empresa);
    }

    @Transactional
    public EmpresaDTO create(CreateEmpresaRequest request) {
        String tenantId = TenantContext.getTenantId();
        log.info("Creando nueva empresa con RUC: {} para tenant: {}", request.getRuc(), tenantId);

        // Validar RUC único
        if (empresaRepository.existsByRuc(request.getRuc())) {
            throw new RuntimeException("Ya existe una empresa con el RUC: " + request.getRuc());
        }

        Empresa empresa = new Empresa();
        empresa.setTenantId(tenantId);
        empresa.setRuc(request.getRuc());
        empresa.setRazonSocial(request.getRazonSocial());
        empresa.setTipoId(request.getTipoId());
        empresa.setDireccion(request.getDireccion());
        empresa.setTelefono(request.getTelefono());
        empresa.setEmail(request.getEmail());
        empresa.setLogoUrl(request.getLogoUrl());
        empresa.setSitioWeb(request.getSitioWeb());
        empresa.setRubroComercial(request.getRubroComercial());
        empresa.setScoreSeguridad(request.getScoreSeguridad() != null ? request.getScoreSeguridad() : 100);
        empresa.setEstadoHabilitacion(request.getEstadoHabilitacion() != null ? request.getEstadoHabilitacion() : "PENDIENTE");
        empresa.setActivo(request.getActivo() != null ? request.getActivo() : true);

        // Agregar contactos si existen
        if (request.getContactos() != null) {
            request.getContactos().forEach(contactoDTO -> {
                EmpresaContacto contacto = new EmpresaContacto();
                contacto.setTenantId(tenantId);
                contacto.setNombreCompleto(contactoDTO.getNombreCompleto());
                contacto.setCargo(contactoDTO.getCargo());
                contacto.setTipoContacto(contactoDTO.getTipoContacto() != null ? contactoDTO.getTipoContacto() : "GENERAL");
                contacto.setTelefono(contactoDTO.getTelefono());
                contacto.setEmail(contactoDTO.getEmail());
                contacto.setEsPrincipal(contactoDTO.getEsPrincipal());
                empresa.addContacto(contacto);
            });
        }

        Empresa savedEmpresa = empresaRepository.save(empresa);
        log.info("Empresa creada exitosamente con ID: {}", savedEmpresa.getEmpresaId());
        return toDTO(savedEmpresa);
    }

    @Transactional
    public EmpresaDTO update(UUID id, UpdateEmpresaRequest request) {
        String tenantId = TenantContext.getTenantId();
        log.info("Actualizando empresa {} para tenant: {}", id, tenantId);

        Empresa empresa = empresaRepository.findByTenantIdAndEmpresaId(tenantId, id)
                .orElseThrow(() -> new RuntimeException("Empresa no encontrada con ID: " + id));

        if (request.getRazonSocial() != null) {
            empresa.setRazonSocial(request.getRazonSocial());
        }
        if (request.getTipoId() != null) {
            empresa.setTipoId(request.getTipoId());
        }
        if (request.getDireccion() != null) {
            empresa.setDireccion(request.getDireccion());
        }
        if (request.getTelefono() != null) {
            empresa.setTelefono(request.getTelefono());
        }
        if (request.getEmail() != null) {
            empresa.setEmail(request.getEmail());
        }
        if (request.getEstadoHabilitacion() != null) {
            empresa.setEstadoHabilitacion(request.getEstadoHabilitacion());
        }
        if (request.getActivo() != null) {
            empresa.setActivo(request.getActivo());
        }
        if (request.getLogoUrl() != null) {
            empresa.setLogoUrl(request.getLogoUrl());
        }
        if (request.getSitioWeb() != null) {
            empresa.setSitioWeb(request.getSitioWeb());
        }
        if (request.getRubroComercial() != null) {
            empresa.setRubroComercial(request.getRubroComercial());
        }
        if (request.getScoreSeguridad() != null) {
            empresa.setScoreSeguridad(request.getScoreSeguridad());
        }

        // Actualizar contactos si se proporcionan
        if (request.getContactos() != null) {
            empresa.getContactos().clear();
            request.getContactos().forEach(contactoDTO -> {
                EmpresaContacto contacto = new EmpresaContacto();
                contacto.setTenantId(tenantId);
                contacto.setNombreCompleto(contactoDTO.getNombreCompleto());
                contacto.setCargo(contactoDTO.getCargo());
                contacto.setTipoContacto(contactoDTO.getTipoContacto() != null ? contactoDTO.getTipoContacto() : "GENERAL");
                contacto.setTelefono(contactoDTO.getTelefono());
                contacto.setEmail(contactoDTO.getEmail());
                contacto.setEsPrincipal(contactoDTO.getEsPrincipal());
                empresa.addContacto(contacto);
            });
        }

        Empresa updatedEmpresa = empresaRepository.save(empresa);
        log.info("Empresa actualizada exitosamente: {}", id);
        return toDTO(updatedEmpresa);
    }

    @Transactional
    public void delete(UUID id) {
        String tenantId = TenantContext.getTenantId();
        log.info("Eliminando empresa {} para tenant: {}", id, tenantId);

        Empresa empresa = empresaRepository.findByTenantIdAndEmpresaId(tenantId, id)
                .orElseThrow(() -> new RuntimeException("Empresa no encontrada con ID: " + id));

        empresaRepository.delete(empresa);
        log.info("Empresa eliminada exitosamente: {}", id);
    }

    @Transactional(readOnly = true)
    public List<EmpresaDTO> search(String searchTerm) {
        String tenantId = TenantContext.getTenantId();
        log.debug("Buscando empresas con término: {} para tenant: {}", searchTerm, tenantId);
        return empresaRepository.searchEmpresas(tenantId, searchTerm).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    private EmpresaDTO toDTO(Empresa empresa) {
        EmpresaDTO dto = new EmpresaDTO();
        dto.setId(empresa.getEmpresaId());
        dto.setTenantId(empresa.getTenantId());
        dto.setRuc(empresa.getRuc());
        dto.setRazonSocial(empresa.getRazonSocial());
        dto.setTipoId(empresa.getTipoId());

        log.debug("Empresa {} - tipoId: {}, tipoContratista: {}",
            empresa.getEmpresaId(),
            empresa.getTipoId(),
            empresa.getTipoContratista());

        if (empresa.getTipoContratista() != null) {
            // Usar el código en lugar del nombre para consistencia
            dto.setTipo(empresa.getTipoContratista().getCodigo());
            log.debug("Tipo asignado: {}", empresa.getTipoContratista().getCodigo());
        } else {
            log.warn("TipoContratista es null para empresa {}", empresa.getEmpresaId());
        }
        dto.setDireccion(empresa.getDireccion());
        dto.setTelefono(empresa.getTelefono());
        dto.setEmail(empresa.getEmail());
        dto.setLogoUrl(empresa.getLogoUrl());
        dto.setSitioWeb(empresa.getSitioWeb());
        dto.setRubroComercial(empresa.getRubroComercial());
        dto.setScoreSeguridad(empresa.getScoreSeguridad());
        dto.setEstadoHabilitacion(empresa.getEstadoHabilitacion());
        dto.setActivo(empresa.getActivo());
        dto.setCreatedAt(empresa.getCreatedAt());

        if (empresa.getContactos() != null && !empresa.getContactos().isEmpty()) {
            List<EmpresaContactoDTO> contactosDTO = empresa.getContactos().stream()
                    .map(this::toContactoDTO)
                    .collect(Collectors.toList());
            dto.setContactos(contactosDTO);
        }

        return dto;
    }

    private EmpresaContactoDTO toContactoDTO(EmpresaContacto contacto) {
        EmpresaContactoDTO dto = new EmpresaContactoDTO();
        dto.setId(contacto.getContactoId());
        dto.setNombreCompleto(contacto.getNombreCompleto());
        dto.setCargo(contacto.getCargo());
        dto.setTipoContacto(contacto.getTipoContacto());
        dto.setTelefono(contacto.getTelefono());
        dto.setEmail(contacto.getEmail());
        dto.setEsPrincipal(contacto.getEsPrincipal());
        return dto;
    }
}
