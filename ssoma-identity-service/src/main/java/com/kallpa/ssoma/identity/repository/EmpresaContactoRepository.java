package com.kallpa.ssoma.identity.repository;

import com.kallpa.ssoma.identity.domain.EmpresaContacto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface EmpresaContactoRepository extends JpaRepository<EmpresaContacto, UUID> {

    List<EmpresaContacto> findByTenantId(String tenantId);

    List<EmpresaContacto> findByEmpresaEmpresaId(UUID empresaId);

    Optional<EmpresaContacto> findByEmpresaEmpresaIdAndEsPrincipalTrue(UUID empresaId);
}
