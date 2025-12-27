package com.kallpa.ssoma.identity.repository;

import com.kallpa.ssoma.identity.domain.Empresa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmpresaRepository extends JpaRepository<Empresa, Long> {

    @Query("SELECT e FROM Empresa e LEFT JOIN FETCH e.tipoContratista WHERE e.tenantId = :tenantId")
    List<Empresa> findByTenantIdWithTipo(@Param("tenantId") String tenantId);

    List<Empresa> findByTenantId(String tenantId);

    @Query("SELECT e FROM Empresa e LEFT JOIN FETCH e.tipoContratista WHERE e.tenantId = :tenantId AND e.empresaId = :empresaId")
    Optional<Empresa> findByTenantIdAndEmpresaIdWithTipo(@Param("tenantId") String tenantId, @Param("empresaId") Long empresaId);

    Optional<Empresa> findByTenantIdAndEmpresaId(String tenantId, Long empresaId);

    Optional<Empresa> findByRuc(String ruc);

    List<Empresa> findByTenantIdAndEstado(String tenantId, String estado);

    @Query("SELECT e FROM Empresa e WHERE e.tenantId = :tenantId AND " +
           "(LOWER(e.razonSocial) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "e.ruc LIKE CONCAT('%', :searchTerm, '%'))")
    List<Empresa> searchEmpresas(@Param("tenantId") String tenantId,
                                  @Param("searchTerm") String searchTerm);

    boolean existsByRuc(String ruc);

    long countByTenantIdAndEstado(String tenantId, String estado);
}
