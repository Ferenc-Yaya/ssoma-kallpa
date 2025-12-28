package com.kallpa.ssoma.assets.repository;

import com.kallpa.ssoma.assets.domain.Activo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ActivoRepository extends JpaRepository<Activo, UUID> {

    List<Activo> findByTenantId(String tenantId);

    Optional<Activo> findByTenantIdAndActivoId(String tenantId, UUID activoId);

    Optional<Activo> findByCodigo(String codigo);

    List<Activo> findByTenantIdAndEstado(String tenantId, String estado);

    List<Activo> findByTenantIdAndEmpresaId(String tenantId, UUID empresaId);

    List<Activo> findByTenantIdAndTipoActivo(String tenantId, String tipoActivo);

    @Query("SELECT a FROM Activo a WHERE a.tenantId = :tenantId AND " +
           "(LOWER(a.codigo) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(a.descripcion) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(a.marca) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(a.modelo) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(a.placa) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(a.serie) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
    List<Activo> searchActivos(@Param("tenantId") String tenantId,
                                @Param("searchTerm") String searchTerm);

    boolean existsByCodigo(String codigo);

    long countByTenantIdAndEstado(String tenantId, String estado);

    long countByTenantIdAndTipoActivo(String tenantId, String tipoActivo);
}
