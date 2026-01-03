package com.kallpa.ssoma.compliance.service;

import com.kallpa.ssoma.compliance.domain.TipoContratistaRequisito;
import com.kallpa.ssoma.compliance.dto.CreateTipoContratistaRequisitoRequest;
import com.kallpa.ssoma.compliance.dto.TipoContratistaRequisitoDTO;
import com.kallpa.ssoma.compliance.dto.UpdateTipoContratistaRequisitoRequest;
import com.kallpa.ssoma.compliance.repository.TipoContratistaRequisitoRepository;
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
public class TipoContratistaRequisitoService {

    private final TipoContratistaRequisitoRepository repository;

    @Transactional(readOnly = true)
    public List<TipoContratistaRequisitoDTO> findAll() {
        String tenantId = TenantContext.getTenantId();
        log.debug("Buscando todos los requisitos para tenant: {}", tenantId);
        return repository.findByTenantId(tenantId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public TipoContratistaRequisitoDTO findById(UUID id) {
        String tenantId = TenantContext.getTenantId();
        log.debug("Buscando requisito {} para tenant: {}", id, tenantId);
        TipoContratistaRequisito requisito = repository.findByTenantIdAndRequisitoId(tenantId, id)
                .orElseThrow(() -> new RuntimeException("Requisito no encontrado con ID: " + id));
        return toDTO(requisito);
    }

    @Transactional(readOnly = true)
    public List<TipoContratistaRequisitoDTO> findByTipoContratista(UUID tipoContratistaId) {
        String tenantId = TenantContext.getTenantId();
        log.debug("Buscando requisitos para tipo contratista {} en tenant: {}", tipoContratistaId, tenantId);
        return repository.findByTenantIdAndTipoContratistaId(tenantId, tipoContratistaId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public TipoContratistaRequisitoDTO create(CreateTipoContratistaRequisitoRequest request) {
        String tenantId = TenantContext.getTenantId();
        log.info("Creando nuevo requisito para tipo contratista {} en tenant: {}",
                request.getTipoContratistaId(), tenantId);

        TipoContratistaRequisito requisito = new TipoContratistaRequisito();
        requisito.setTenantId(tenantId);
        requisito.setTipoContratistaId(request.getTipoContratistaId());
        requisito.setCategoriaRequisito(request.getCategoriaRequisito());
        requisito.setDocumentoRequeribleId(request.getDocumentoRequeribleId());
        requisito.setObligatorio(request.getObligatorio() != null ? request.getObligatorio() : true);
        requisito.setAplica(request.getAplica() != null ? request.getAplica() : true);

        requisito = repository.save(requisito);
        log.info("Requisito creado exitosamente con ID: {}", requisito.getRequisitoId());
        return toDTO(requisito);
    }

    @Transactional
    public TipoContratistaRequisitoDTO update(UUID id, UpdateTipoContratistaRequisitoRequest request) {
        String tenantId = TenantContext.getTenantId();
        log.info("Actualizando requisito {} para tenant: {}", id, tenantId);

        TipoContratistaRequisito requisito = repository.findByTenantIdAndRequisitoId(tenantId, id)
                .orElseThrow(() -> new RuntimeException("Requisito no encontrado con ID: " + id));

        if (request.getTipoContratistaId() != null) {
            requisito.setTipoContratistaId(request.getTipoContratistaId());
        }
        if (request.getCategoriaRequisito() != null) {
            requisito.setCategoriaRequisito(request.getCategoriaRequisito());
        }
        if (request.getDocumentoRequeribleId() != null) {
            requisito.setDocumentoRequeribleId(request.getDocumentoRequeribleId());
        }
        if (request.getObligatorio() != null) {
            requisito.setObligatorio(request.getObligatorio());
        }
        if (request.getAplica() != null) {
            requisito.setAplica(request.getAplica());
        }

        requisito = repository.save(requisito);
        log.info("Requisito actualizado exitosamente: {}", id);
        return toDTO(requisito);
    }

    @Transactional
    public void delete(UUID id) {
        String tenantId = TenantContext.getTenantId();
        log.info("Eliminando requisito {} para tenant: {}", id, tenantId);

        TipoContratistaRequisito requisito = repository.findByTenantIdAndRequisitoId(tenantId, id)
                .orElseThrow(() -> new RuntimeException("Requisito no encontrado con ID: " + id));

        repository.delete(requisito);
        log.info("Requisito eliminado exitosamente: {}", id);
    }

    private TipoContratistaRequisitoDTO toDTO(TipoContratistaRequisito requisito) {
        TipoContratistaRequisitoDTO dto = new TipoContratistaRequisitoDTO();
        dto.setRequisitoId(requisito.getRequisitoId());
        dto.setTenantId(requisito.getTenantId());
        dto.setTipoContratistaId(requisito.getTipoContratistaId());
        dto.setCategoriaRequisito(requisito.getCategoriaRequisito());
        dto.setDocumentoRequeribleId(requisito.getDocumentoRequeribleId());
        dto.setObligatorio(requisito.getObligatorio());
        dto.setAplica(requisito.getAplica());
        dto.setCreatedAt(requisito.getCreatedAt());
        return dto;
    }
}
