package com.kallpa.ssoma.compliance.repository;

import com.kallpa.ssoma.compliance.domain.ReglaNegocio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ReglaRepository extends JpaRepository<ReglaNegocio, UUID> {

    @Query("SELECT r FROM ReglaNegocio r WHERE r.tenantId = :tenantId AND r.activa = true")
    List<ReglaNegocio> findReglasActivas(String tenantId);

    List<ReglaNegocio> findByTenantIdAndCategoriaAndActivaTrue(String tenantId, String categoria);
}