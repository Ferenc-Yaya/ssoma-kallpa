package com.kallpa.ssoma.identity.repository;

import com.kallpa.ssoma.identity.domain.EmpresaContacto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmpresaContactoRepository extends JpaRepository<EmpresaContacto, Long> {

    List<EmpresaContacto> findByTenantId(String tenantId);

    List<EmpresaContacto> findByEmpresaEmpresaId(Long empresaId);

    Optional<EmpresaContacto> findByEmpresaEmpresaIdAndEsPrincipalTrue(Long empresaId);
}
