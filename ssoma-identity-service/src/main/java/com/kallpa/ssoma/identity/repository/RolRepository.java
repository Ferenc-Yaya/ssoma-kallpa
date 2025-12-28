package com.kallpa.ssoma.identity.repository;

import com.kallpa.ssoma.identity.domain.Rol;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface RolRepository extends JpaRepository<Rol, UUID> {

    Optional<Rol> findByTenantIdAndNombreRol(String tenantId, String nombreRol);

    boolean existsByTenantIdAndNombreRol(String tenantId, String nombreRol);

    Optional<Rol> findByCodigo(String codigo);

    Optional<Rol> findByNombreRol(String nombreRol);
}