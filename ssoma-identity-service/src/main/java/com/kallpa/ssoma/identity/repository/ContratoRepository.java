package com.kallpa.ssoma.identity.repository;

import com.kallpa.ssoma.identity.domain.Contrato;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ContratoRepository extends JpaRepository<Contrato, UUID> {

    @Query("SELECT c FROM Contrato c LEFT JOIN FETCH c.empresa WHERE c.tenantId = :tenantId")
    List<Contrato> findByTenantIdWithEmpresa(@Param("tenantId") String tenantId);

    List<Contrato> findByTenantId(String tenantId);

    @Query("SELECT c FROM Contrato c LEFT JOIN FETCH c.empresa WHERE c.tenantId = :tenantId AND c.contratoId = :contratoId")
    Optional<Contrato> findByTenantIdAndContratoIdWithEmpresa(@Param("tenantId") String tenantId, @Param("contratoId") UUID contratoId);

    Optional<Contrato> findByTenantIdAndContratoId(String tenantId, UUID contratoId);

    Optional<Contrato> findByNumeroContrato(String numeroContrato);

    List<Contrato> findByTenantIdAndEstado(String tenantId, String estado);

    List<Contrato> findByTenantIdAndEmpresaId(String tenantId, UUID empresaId);

    @Query("SELECT c FROM Contrato c WHERE c.tenantId = :tenantId AND " +
           "(LOWER(c.numeroContrato) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(c.descripcionServicio) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(c.numeroOc) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
    List<Contrato> searchContratos(@Param("tenantId") String tenantId,
                                    @Param("searchTerm") String searchTerm);

    boolean existsByNumeroContrato(String numeroContrato);

    long countByTenantIdAndEstado(String tenantId, String estado);
}
