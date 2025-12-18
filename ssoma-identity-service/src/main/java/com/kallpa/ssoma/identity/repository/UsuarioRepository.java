package com.kallpa.ssoma.identity.repository;

import com.kallpa.ssoma.identity.domain.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    Optional<Usuario> findByUsername(String username);

    Optional<Usuario> findByTenantIdAndUsername(String tenantId, String username);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);
}