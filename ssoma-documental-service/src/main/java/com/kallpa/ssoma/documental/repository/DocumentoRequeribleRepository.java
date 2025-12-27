package com.kallpa.ssoma.documental.repository;

import com.kallpa.ssoma.documental.domain.DocumentoRequerible;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DocumentoRequeribleRepository extends JpaRepository<DocumentoRequerible, Long> {

    List<DocumentoRequerible> findByTenantId(String tenantId);

    Optional<DocumentoRequerible> findByTenantIdAndDocumentoRequeribleId(String tenantId, Long documentoRequeribleId);

    List<DocumentoRequerible> findByTenantIdAndCategoria(String tenantId, String categoria);

    List<DocumentoRequerible> findByTenantIdAndObligatorio(String tenantId, Boolean obligatorio);

    @Query("SELECT d FROM DocumentoRequerible d WHERE d.tenantId = :tenantId AND " +
           "(LOWER(d.nombre) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(d.descripcion) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
    List<DocumentoRequerible> searchDocumentosRequeribles(@Param("tenantId") String tenantId,
                                                           @Param("searchTerm") String searchTerm);

    long countByTenantIdAndCategoria(String tenantId, String categoria);
}
