package com.kallpa.ssoma.identity.repository;

import com.kallpa.ssoma.identity.domain.Sede;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface SedeRepository extends JpaRepository<Sede, UUID> {

    List<Sede> findByTenantIdAndEmpresaId(String tenantId, UUID empresaId);

    List<Sede> findByTenantId(String tenantId);

    long countByTenantIdAndEmpresaId(String tenantId, UUID empresaId);
}
