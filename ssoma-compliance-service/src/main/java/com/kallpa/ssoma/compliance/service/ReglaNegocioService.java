package com.kallpa.ssoma.compliance.service;

import com.kallpa.ssoma.compliance.domain.ReglaNegocio;
import com.kallpa.ssoma.compliance.dto.CreateReglaNegocioRequest;
import com.kallpa.ssoma.compliance.dto.ReglaNegocioDTO;
import com.kallpa.ssoma.compliance.dto.UpdateReglaNegocioRequest;
import com.kallpa.ssoma.compliance.repository.ReglaRepository;
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
public class ReglaNegocioService {

    private final ReglaRepository reglaRepository;

    @Transactional(readOnly = true)
    public List<ReglaNegocioDTO> findAll() {
        String tenantId = TenantContext.getTenantId();
        log.debug("Buscando todas las reglas de negocio para tenant: {}", tenantId);
        return reglaRepository.findByTenantId(tenantId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ReglaNegocioDTO findById(UUID id) {
        String tenantId = TenantContext.getTenantId();
        log.debug("Buscando regla de negocio {} para tenant: {}", id, tenantId);
        ReglaNegocio regla = reglaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Regla de negocio no encontrada con ID: " + id));

        if (!regla.getTenantId().equals(tenantId)) {
            throw new RuntimeException("Acceso denegado a esta regla de negocio");
        }

        return toDTO(regla);
    }

    @Transactional
    public ReglaNegocioDTO create(CreateReglaNegocioRequest request) {
        String tenantId = TenantContext.getTenantId();
        log.info("Creando nueva regla de negocio {} para tenant: {}", request.getNombreRegla(), tenantId);

        ReglaNegocio regla = new ReglaNegocio();
        regla.setTenantId(tenantId);
        regla.setAplicarATipoEmpresa(request.getAplicarATipoEmpresa());
        regla.setAplicarARolOTipo(request.getAplicarARolOTipo());
        regla.setEntidadObjetivo(request.getEntidadObjetivo());
        regla.setDocReqId(request.getDocReqId());
        regla.setNombreRegla(request.getNombreRegla());
        regla.setCategoria(request.getCategoria());
        regla.setCondicion(request.getCondicion());
        regla.setDiasVigenciaMinima(request.getDiasVigenciaMinima() != null ? request.getDiasVigenciaMinima() : 0);
        regla.setEsBloqueante(request.getEsBloqueante() != null ? request.getEsBloqueante() : true);
        regla.setColorSemaforo(request.getColorSemaforo());
        regla.setMensajeAlerta(request.getMensajeAlerta());
        regla.setActiva(request.getActiva() != null ? request.getActiva() : true);
        regla.setActivo(request.getActivo() != null ? request.getActivo() : true);

        regla = reglaRepository.save(regla);
        log.info("Regla de negocio creada exitosamente con ID: {}", regla.getReglaId());
        return toDTO(regla);
    }

    @Transactional
    public ReglaNegocioDTO update(UUID id, UpdateReglaNegocioRequest request) {
        String tenantId = TenantContext.getTenantId();
        log.info("Actualizando regla de negocio {} para tenant: {}", id, tenantId);

        ReglaNegocio regla = reglaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Regla de negocio no encontrada con ID: " + id));

        if (!regla.getTenantId().equals(tenantId)) {
            throw new RuntimeException("Acceso denegado a esta regla de negocio");
        }

        if (request.getAplicarATipoEmpresa() != null) {
            regla.setAplicarATipoEmpresa(request.getAplicarATipoEmpresa());
        }
        if (request.getAplicarARolOTipo() != null) {
            regla.setAplicarARolOTipo(request.getAplicarARolOTipo());
        }
        if (request.getEntidadObjetivo() != null) {
            regla.setEntidadObjetivo(request.getEntidadObjetivo());
        }
        if (request.getDocReqId() != null) {
            regla.setDocReqId(request.getDocReqId());
        }
        if (request.getNombreRegla() != null) {
            regla.setNombreRegla(request.getNombreRegla());
        }
        if (request.getCategoria() != null) {
            regla.setCategoria(request.getCategoria());
        }
        if (request.getCondicion() != null) {
            regla.setCondicion(request.getCondicion());
        }
        if (request.getDiasVigenciaMinima() != null) {
            regla.setDiasVigenciaMinima(request.getDiasVigenciaMinima());
        }
        if (request.getEsBloqueante() != null) {
            regla.setEsBloqueante(request.getEsBloqueante());
        }
        if (request.getColorSemaforo() != null) {
            regla.setColorSemaforo(request.getColorSemaforo());
        }
        if (request.getMensajeAlerta() != null) {
            regla.setMensajeAlerta(request.getMensajeAlerta());
        }
        if (request.getActiva() != null) {
            regla.setActiva(request.getActiva());
        }
        if (request.getActivo() != null) {
            regla.setActivo(request.getActivo());
        }

        regla = reglaRepository.save(regla);
        log.info("Regla de negocio actualizada exitosamente: {}", id);
        return toDTO(regla);
    }

    @Transactional
    public void delete(UUID id) {
        String tenantId = TenantContext.getTenantId();
        log.info("Eliminando regla de negocio {} para tenant: {}", id, tenantId);

        ReglaNegocio regla = reglaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Regla de negocio no encontrada con ID: " + id));

        if (!regla.getTenantId().equals(tenantId)) {
            throw new RuntimeException("Acceso denegado a esta regla de negocio");
        }

        reglaRepository.delete(regla);
        log.info("Regla de negocio eliminada exitosamente: {}", id);
    }

    @Transactional(readOnly = true)
    public List<ReglaNegocioDTO> findByCategoria(String categoria) {
        String tenantId = TenantContext.getTenantId();
        log.debug("Buscando reglas por categoría {} para tenant: {}", categoria, tenantId);
        return reglaRepository.findByTenantIdAndCategoria(tenantId, categoria).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ReglaNegocioDTO> findActivas() {
        String tenantId = TenantContext.getTenantId();
        log.debug("Buscando reglas activas para tenant: {}", tenantId);
        return reglaRepository.findByTenantIdAndActivaTrue(tenantId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    private ReglaNegocioDTO toDTO(ReglaNegocio regla) {
        ReglaNegocioDTO dto = new ReglaNegocioDTO();
        dto.setReglaId(regla.getReglaId());
        dto.setTenantId(regla.getTenantId());
        dto.setAplicarATipoEmpresa(regla.getAplicarATipoEmpresa());
        dto.setAplicarARolOTipo(regla.getAplicarARolOTipo());
        dto.setEntidadObjetivo(regla.getEntidadObjetivo());
        dto.setDocReqId(regla.getDocReqId());
        dto.setNombreRegla(regla.getNombreRegla());
        dto.setCategoria(regla.getCategoria());
        dto.setCondicion(regla.getCondicion());
        dto.setDiasVigenciaMinima(regla.getDiasVigenciaMinima());
        dto.setEsBloqueante(regla.getEsBloqueante());
        dto.setColorSemaforo(regla.getColorSemaforo());
        dto.setMensajeAlerta(regla.getMensajeAlerta());
        dto.setActiva(regla.getActiva());
        dto.setActivo(regla.getActivo());
        dto.setCreatedAt(regla.getCreatedAt());
        return dto;
    }
}
