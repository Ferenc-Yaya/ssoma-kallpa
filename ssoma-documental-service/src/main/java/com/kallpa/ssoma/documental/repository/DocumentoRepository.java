package com.kallpa.ssoma.documental.repository;

import com.kallpa.ssoma.documental.domain.Documento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface DocumentoRepository extends JpaRepository<Documento, UUID> {

    @Query("SELECT d FROM Documento d LEFT JOIN FETCH d.documentoRequerible WHERE d.tenantId = :tenantId")
    List<Documento> findByTenantIdWithRequerible(@Param("tenantId") String tenantId);

    List<Documento> findByTenantId(String tenantId);

    @Query("SELECT d FROM Documento d LEFT JOIN FETCH d.documentoRequerible WHERE d.tenantId = :tenantId AND d.documentoId = :documentoId")
    Optional<Documento> findByTenantIdAndDocumentoIdWithRequerible(@Param("tenantId") String tenantId, @Param("documentoId") UUID documentoId);

    Optional<Documento> findByTenantIdAndDocumentoId(String tenantId, UUID documentoId);

    List<Documento> findByTenantIdAndEntidadTipoAndEntidadId(String tenantId, String entidadTipo, UUID entidadId);

    List<Documento> findByTenantIdAndEstado(String tenantId, String estado);

    List<Documento> findByTenantIdAndEntidadTipo(String tenantId, String entidadTipo);

    @Query("SELECT d FROM Documento d WHERE d.tenantId = :tenantId AND " +
           "d.fechaVencimiento BETWEEN :fechaInicio AND :fechaFin")
    List<Documento> findByTenantIdAndFechaVencimientoBetween(@Param("tenantId") String tenantId,
                                                              @Param("fechaInicio") LocalDate fechaInicio,
                                                              @Param("fechaFin") LocalDate fechaFin);

    @Query("SELECT d FROM Documento d WHERE d.tenantId = :tenantId AND " +
           "(LOWER(d.nombreArchivo) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(d.observaciones) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
    List<Documento> searchDocumentos(@Param("tenantId") String tenantId,
                                      @Param("searchTerm") String searchTerm);

    long countByTenantIdAndEstado(String tenantId, String estado);

    long countByTenantIdAndEntidadTipoAndEntidadId(String tenantId, String entidadTipo, UUID entidadId);
}
