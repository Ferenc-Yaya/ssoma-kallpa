package com.kallpa.ssoma.documental.service;

import com.kallpa.ssoma.documental.domain.Documento;
import com.kallpa.ssoma.documental.dto.CreateDocumentoRequest;
import com.kallpa.ssoma.documental.dto.DocumentoDTO;
import com.kallpa.ssoma.documental.dto.UpdateDocumentoRequest;
import com.kallpa.ssoma.documental.repository.DocumentoRepository;
import com.kallpa.ssoma.shared.context.TenantContext;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class DocumentoService {

    private final DocumentoRepository documentoRepository;

    @Transactional(readOnly = true)
    public List<DocumentoDTO> findAll() {
        String tenantId = TenantContext.getTenantId();
        log.debug("Buscando todos los documentos para tenant: {}", tenantId);
        return documentoRepository.findByTenantIdWithRequerible(tenantId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public DocumentoDTO findById(UUID id) {
        String tenantId = TenantContext.getTenantId();
        log.debug("Buscando documento {} para tenant: {}", id, tenantId);
        Documento documento = documentoRepository.findByTenantIdAndDocumentoIdWithRequerible(tenantId, id)
                .orElseThrow(() -> new RuntimeException("Documento no encontrado con ID: " + id));
        return toDTO(documento);
    }

    @Transactional
    public DocumentoDTO create(CreateDocumentoRequest request) {
        String tenantId = TenantContext.getTenantId();
        log.info("Creando nuevo documento {} para entidad {} {} en tenant: {}",
                request.getNombreArchivo(), request.getEntidadTipo(), request.getEntidadId(), tenantId);

        Documento documento = new Documento();
        documento.setTenantId(tenantId);
        documento.setEntidadTipo(request.getEntidadTipo());
        documento.setEntidadId(request.getEntidadId());
        documento.setDocumentoRequeribleId(request.getDocumentoRequeribleId());
        documento.setNombreArchivo(request.getNombreArchivo());
        documento.setRutaArchivo(request.getRutaArchivo());
        documento.setFechaEmision(request.getFechaEmision());
        documento.setFechaVencimiento(request.getFechaVencimiento());
        documento.setEstado(request.getEstado() != null ? request.getEstado() : "VIGENTE");
        documento.setObservaciones(request.getObservaciones());

        Documento savedDocumento = documentoRepository.save(documento);
        log.info("Documento creado exitosamente con ID: {}", savedDocumento.getDocumentoId());
        return toDTO(savedDocumento);
    }

    @Transactional
    public DocumentoDTO update(UUID id, UpdateDocumentoRequest request) {
        String tenantId = TenantContext.getTenantId();
        log.info("Actualizando documento {} para tenant: {}", id, tenantId);

        Documento documento = documentoRepository.findByTenantIdAndDocumentoId(tenantId, id)
                .orElseThrow(() -> new RuntimeException("Documento no encontrado con ID: " + id));

        if (request.getNombreArchivo() != null) {
            documento.setNombreArchivo(request.getNombreArchivo());
        }
        if (request.getRutaArchivo() != null) {
            documento.setRutaArchivo(request.getRutaArchivo());
        }
        if (request.getFechaEmision() != null) {
            documento.setFechaEmision(request.getFechaEmision());
        }
        if (request.getFechaVencimiento() != null) {
            documento.setFechaVencimiento(request.getFechaVencimiento());
        }
        if (request.getEstado() != null) {
            documento.setEstado(request.getEstado());
        }
        if (request.getObservaciones() != null) {
            documento.setObservaciones(request.getObservaciones());
        }

        Documento updatedDocumento = documentoRepository.save(documento);
        log.info("Documento actualizado exitosamente: {}", id);
        return toDTO(updatedDocumento);
    }

    @Transactional
    public void delete(UUID id) {
        String tenantId = TenantContext.getTenantId();
        log.info("Eliminando documento {} para tenant: {}", id, tenantId);

        Documento documento = documentoRepository.findByTenantIdAndDocumentoId(tenantId, id)
                .orElseThrow(() -> new RuntimeException("Documento no encontrado con ID: " + id));

        documentoRepository.delete(documento);
        log.info("Documento eliminado exitosamente: {}", id);
    }

    @Transactional(readOnly = true)
    public List<DocumentoDTO> search(String searchTerm) {
        String tenantId = TenantContext.getTenantId();
        log.debug("Buscando documentos con término: {} para tenant: {}", searchTerm, tenantId);
        return documentoRepository.searchDocumentos(tenantId, searchTerm).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<DocumentoDTO> findByEntidad(String entidadTipo, UUID entidadId) {
        String tenantId = TenantContext.getTenantId();
        log.debug("Buscando documentos de {} {} para tenant: {}", entidadTipo, entidadId, tenantId);
        return documentoRepository.findByTenantIdAndEntidadTipoAndEntidadId(tenantId, entidadTipo, entidadId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<DocumentoDTO> findByEstado(String estado) {
        String tenantId = TenantContext.getTenantId();
        log.debug("Buscando documentos con estado {} para tenant: {}", estado, tenantId);
        return documentoRepository.findByTenantIdAndEstado(tenantId, estado).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<DocumentoDTO> findProximosAVencer(int dias) {
        String tenantId = TenantContext.getTenantId();
        LocalDate hoy = LocalDate.now();
        LocalDate fechaLimite = hoy.plusDays(dias);
        log.debug("Buscando documentos que vencen entre {} y {} para tenant: {}", hoy, fechaLimite, tenantId);
        return documentoRepository.findByTenantIdAndFechaVencimientoBetween(tenantId, hoy, fechaLimite).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    private DocumentoDTO toDTO(Documento documento) {
        DocumentoDTO dto = new DocumentoDTO();
        dto.setId(documento.getDocumentoId());
        dto.setTenantId(documento.getTenantId());
        dto.setEntidadTipo(documento.getEntidadTipo());
        dto.setEntidadId(documento.getEntidadId());
        dto.setDocumentoRequeribleId(documento.getDocumentoRequeribleId());

        log.debug("Documento {} - documentoRequeribleId: {}, documentoRequerible: {}",
            documento.getDocumentoId(),
            documento.getDocumentoRequeribleId(),
            documento.getDocumentoRequerible());

        if (documento.getDocumentoRequerible() != null) {
            dto.setDocumentoRequeribleNombre(documento.getDocumentoRequerible().getNombre());
            log.debug("Documento requerible asignado: {}", documento.getDocumentoRequerible().getNombre());
        } else {
            log.debug("Documento requerible es null para documento {} (puede ser válido si es documento libre)",
                    documento.getDocumentoId());
        }

        dto.setNombreArchivo(documento.getNombreArchivo());
        dto.setRutaArchivo(documento.getRutaArchivo());
        dto.setFechaEmision(documento.getFechaEmision());
        dto.setFechaVencimiento(documento.getFechaVencimiento());
        dto.setEstado(documento.getEstado());
        dto.setObservaciones(documento.getObservaciones());
        dto.setCreatedAt(documento.getCreatedAt());

        return dto;
    }
}
