package com.kallpa.ssoma.assets.repository;

import com.kallpa.ssoma.assets.domain.Asignacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AsignacionRepository extends JpaRepository<Asignacion, UUID> {

    List<Asignacion> findByTenantId(String tenantId);

    Optional<Asignacion> findByTenantIdAndAsignacionId(String tenantId, UUID asignacionId);

    List<Asignacion> findByTenantIdAndActivoId(String tenantId, UUID activoId);

    List<Asignacion> findByTenantIdAndPersonaId(String tenantId, UUID personaId);

    List<Asignacion> findByTenantIdAndEstado(String tenantId, String estado);
}
