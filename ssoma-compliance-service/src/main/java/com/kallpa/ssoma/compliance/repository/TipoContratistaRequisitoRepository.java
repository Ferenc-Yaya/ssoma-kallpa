package com.kallpa.ssoma.compliance.repository;

import com.kallpa.ssoma.compliance.domain.TipoContratistaRequisito;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TipoContratistaRequisitoRepository extends JpaRepository<TipoContratistaRequisito, UUID> {

    List<TipoContratistaRequisito> findByTenantId(String tenantId);

    Optional<TipoContratistaRequisito> findByTenantIdAndRequisitoId(String tenantId, UUID requisitoId);

    List<TipoContratistaRequisito> findByTenantIdAndTipoContratistaId(String tenantId, UUID tipoContratistaId);

    List<TipoContratistaRequisito> findByTenantIdAndCategoriaRequisito(String tenantId, String categoriaRequisito);

    List<TipoContratistaRequisito> findByTenantIdAndTipoContratistaIdAndCategoriaRequisito(
            String tenantId, UUID tipoContratistaId, String categoriaRequisito);

    @Query("SELECT r FROM TipoContratistaRequisito r WHERE r.tenantId = :tenantId AND r.aplica = true")
    List<TipoContratistaRequisito> findAplicables(@Param("tenantId") String tenantId);

    @Query("SELECT r FROM TipoContratistaRequisito r WHERE r.tenantId = :tenantId " +
            "AND r.tipoContratistaId = :tipoContratistaId AND r.aplica = true")
    List<TipoContratistaRequisito> findAplicablesByTipoContratista(
            @Param("tenantId") String tenantId,
            @Param("tipoContratistaId") UUID tipoContratistaId);
}
