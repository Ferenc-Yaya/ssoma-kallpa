package com.kallpa.ssoma.identity.repository;

import com.kallpa.ssoma.identity.domain.Empresa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface EmpresaRepository extends JpaRepository<Empresa, UUID> {

    @Query("SELECT e FROM Empresa e LEFT JOIN FETCH e.tipoContratista WHERE e.tenantId = :tenantId")
    List<Empresa> findByTenantIdWithTipo(@Param("tenantId") String tenantId);

    @Query("SELECT e FROM Empresa e LEFT JOIN FETCH e.tipoContratista")
    List<Empresa> findAllWithTipo();

    List<Empresa> findByTenantId(String tenantId);

    @Query("SELECT e FROM Empresa e LEFT JOIN FETCH e.tipoContratista WHERE e.tenantId = :tenantId AND e.empresaId = :empresaId")
    Optional<Empresa> findByTenantIdAndEmpresaIdWithTipo(@Param("tenantId") String tenantId, @Param("empresaId") UUID empresaId);

    Optional<Empresa> findByTenantIdAndEmpresaId(String tenantId, UUID empresaId);

    Optional<Empresa> findByRuc(String ruc);

    List<Empresa> findByTenantIdAndActivo(String tenantId, Boolean activo);

    @Query("SELECT e FROM Empresa e WHERE e.tenantId = :tenantId AND " +
           "(LOWER(e.razonSocial) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "e.ruc LIKE CONCAT('%', :searchTerm, '%'))")
    List<Empresa> searchEmpresas(@Param("tenantId") String tenantId,
                                  @Param("searchTerm") String searchTerm);

    boolean existsByRuc(String ruc);

    long countByTenantIdAndActivo(String tenantId, Boolean activo);
}
