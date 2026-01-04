package com.kallpa.ssoma.identity.service;

import com.kallpa.ssoma.identity.domain.Contrato;
import com.kallpa.ssoma.identity.dto.ContratoDTO;
import com.kallpa.ssoma.identity.dto.request.CreateContratoRequest;
import com.kallpa.ssoma.identity.dto.request.UpdateContratoRequest;
import com.kallpa.ssoma.identity.repository.ContratoRepository;
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
public class ContratoService {

    private final ContratoRepository contratoRepository;

    @Transactional(readOnly = true)
    public List<ContratoDTO> findAll() {
        String tenantId = TenantContext.getTenantId();
        log.debug("Buscando todos los contratos para tenant: {}", tenantId);
        return contratoRepository.findByTenantIdWithEmpresa(tenantId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ContratoDTO findById(UUID id) {
        String tenantId = TenantContext.getTenantId();
        log.debug("Buscando contrato {} para tenant: {}", id, tenantId);
        Contrato contrato = contratoRepository.findByTenantIdAndContratoIdWithEmpresa(tenantId, id)
                .orElseThrow(() -> new RuntimeException("Contrato no encontrado con ID: " + id));
        return toDTO(contrato);
    }

    @Transactional
    public ContratoDTO create(CreateContratoRequest request) {
        String tenantId = TenantContext.getTenantId();
        log.info("Creando nuevo contrato {} para tenant: {}", request.getNumeroContrato(), tenantId);

        // Validar número de contrato único
        if (contratoRepository.existsByNumeroContrato(request.getNumeroContrato())) {
            throw new RuntimeException("Ya existe un contrato con el número: " + request.getNumeroContrato());
        }

        Contrato contrato = new Contrato();
        contrato.setTenantId(tenantId);
        contrato.setEmpresaId(request.getEmpresaId());
        contrato.setNumeroContrato(request.getNumeroContrato());
        contrato.setNumeroOc(request.getNumeroOc());
        contrato.setDescripcionServicio(request.getDescripcionServicio());
        contrato.setFechaInicio(request.getFechaInicio());
        contrato.setFechaFin(request.getFechaFin());
        contrato.setNivelRiesgo(request.getNivelRiesgo() != null ? request.getNivelRiesgo() : "MEDIO");
        contrato.setAdminContratoKallpa(request.getAdminContratoKallpa());
        contrato.setMontoTotal(request.getMontoTotal());
        contrato.setActividadesCriticas(request.getActividadesCriticas());
        contrato.setEstado(request.getEstado() != null ? request.getEstado() : "ACTIVO");

        Contrato savedContrato = contratoRepository.save(contrato);
        log.info("Contrato creado exitosamente con ID: {}", savedContrato.getContratoId());
        return toDTO(savedContrato);
    }

    @Transactional
    public ContratoDTO update(UUID id, UpdateContratoRequest request) {
        String tenantId = TenantContext.getTenantId();
        log.info("Actualizando contrato {} para tenant: {}", id, tenantId);

        Contrato contrato = contratoRepository.findByTenantIdAndContratoId(tenantId, id)
                .orElseThrow(() -> new RuntimeException("Contrato no encontrado con ID: " + id));

        if (request.getEmpresaId() != null) {
            contrato.setEmpresaId(request.getEmpresaId());
        }
        if (request.getNumeroContrato() != null) {
            contrato.setNumeroContrato(request.getNumeroContrato());
        }
        if (request.getNumeroOc() != null) {
            contrato.setNumeroOc(request.getNumeroOc());
        }
        if (request.getDescripcionServicio() != null) {
            contrato.setDescripcionServicio(request.getDescripcionServicio());
        }
        if (request.getFechaInicio() != null) {
            contrato.setFechaInicio(request.getFechaInicio());
        }
        if (request.getFechaFin() != null) {
            contrato.setFechaFin(request.getFechaFin());
        }
        if (request.getNivelRiesgo() != null) {
            contrato.setNivelRiesgo(request.getNivelRiesgo());
        }
        if (request.getAdminContratoKallpa() != null) {
            contrato.setAdminContratoKallpa(request.getAdminContratoKallpa());
        }
        if (request.getMontoTotal() != null) {
            contrato.setMontoTotal(request.getMontoTotal());
        }
        if (request.getActividadesCriticas() != null) {
            contrato.setActividadesCriticas(request.getActividadesCriticas());
        }
        if (request.getEstado() != null) {
            contrato.setEstado(request.getEstado());
        }

        Contrato updatedContrato = contratoRepository.save(contrato);
        log.info("Contrato actualizado exitosamente: {}", id);
        return toDTO(updatedContrato);
    }

    @Transactional
    public void delete(UUID id) {
        String tenantId = TenantContext.getTenantId();
        log.info("Eliminando contrato {} para tenant: {}", id, tenantId);

        Contrato contrato = contratoRepository.findByTenantIdAndContratoId(tenantId, id)
                .orElseThrow(() -> new RuntimeException("Contrato no encontrado con ID: " + id));

        contratoRepository.delete(contrato);
        log.info("Contrato eliminado exitosamente: {}", id);
    }

    @Transactional(readOnly = true)
    public List<ContratoDTO> search(String searchTerm) {
        String tenantId = TenantContext.getTenantId();
        log.debug("Buscando contratos con término: {} para tenant: {}", searchTerm, tenantId);
        return contratoRepository.searchContratos(tenantId, searchTerm).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ContratoDTO> findByEmpresaId(UUID empresaId) {
        String tenantId = TenantContext.getTenantId();
        log.debug("Buscando contratos de la empresa {} para tenant: {}", empresaId, tenantId);
        return contratoRepository.findByTenantIdAndEmpresaId(tenantId, empresaId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    private ContratoDTO toDTO(Contrato contrato) {
        ContratoDTO dto = new ContratoDTO();
        dto.setId(contrato.getContratoId());
        dto.setTenantId(contrato.getTenantId());
        dto.setEmpresaId(contrato.getEmpresaId());

        log.debug("Contrato {} - empresaId: {}, empresa: {}",
            contrato.getContratoId(),
            contrato.getEmpresaId(),
            contrato.getEmpresa());

        if (contrato.getEmpresa() != null) {
            dto.setEmpresaNombre(contrato.getEmpresa().getRazonSocial());
            log.debug("Empresa asignada: {}", contrato.getEmpresa().getRazonSocial());
        } else {
            log.warn("Empresa es null para contrato {}", contrato.getContratoId());
        }

        dto.setNumeroContrato(contrato.getNumeroContrato());
        dto.setNumeroOc(contrato.getNumeroOc());
        dto.setDescripcionServicio(contrato.getDescripcionServicio());
        dto.setFechaInicio(contrato.getFechaInicio());
        dto.setFechaFin(contrato.getFechaFin());
        dto.setNivelRiesgo(contrato.getNivelRiesgo());
        dto.setAdminContratoKallpa(contrato.getAdminContratoKallpa());
        dto.setMontoTotal(contrato.getMontoTotal());
        dto.setActividadesCriticas(contrato.getActividadesCriticas() != null ? contrato.getActividadesCriticas().toString() : null);
        dto.setEstado(contrato.getEstado());
        dto.setCreatedAt(contrato.getCreatedAt());

        return dto;
    }
}
