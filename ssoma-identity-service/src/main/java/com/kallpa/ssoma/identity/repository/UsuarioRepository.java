package com.kallpa.ssoma.identity.repository;

import com.kallpa.ssoma.identity.domain.Rol;
import com.kallpa.ssoma.identity.domain.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, UUID> {

    Optional<Usuario> findByUsername(String username);

    Optional<Usuario> findByTenantIdAndUsername(String tenantId, String username);

    List<Usuario> findByTenantId(String tenantId);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

    long countByRol(Rol rol);
}