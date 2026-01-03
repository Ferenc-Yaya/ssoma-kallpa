package com.kallpa.ssoma.compliance.repository;

import com.kallpa.ssoma.compliance.domain.EstadoCumplimiento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface EstadoCumplimientoRepository extends JpaRepository<EstadoCumplimiento, UUID> {

    List<EstadoCumplimiento> findByTenantId(String tenantId);

    Optional<EstadoCumplimiento> findByTenantIdAndEstadoId(String tenantId, UUID estadoId);

    Optional<EstadoCumplimiento> findByTenantIdAndEntidadIdAndTipoEntidad(
            String tenantId, UUID entidadId, String tipoEntidad);

    List<EstadoCumplimiento> findByTenantIdAndTipoEntidad(String tenantId, String tipoEntidad);

    List<EstadoCumplimiento> findByTenantIdAndColorSemaforo(String tenantId, String colorSemaforo);

    List<EstadoCumplimiento> findByTenantIdAndEsApto(String tenantId, Boolean esApto);

    @Query("SELECT e FROM EstadoCumplimiento e WHERE e.tenantId = :tenantId AND e.esApto = false")
    List<EstadoCumplimiento> findNoAptos(@Param("tenantId") String tenantId);

    @Query("SELECT e FROM EstadoCumplimiento e WHERE e.tenantId = :tenantId " +
            "AND (e.colorSemaforo = 'ROJO' OR e.colorSemaforo = 'AMARILLO')")
    List<EstadoCumplimiento> findConAlertas(@Param("tenantId") String tenantId);
}
