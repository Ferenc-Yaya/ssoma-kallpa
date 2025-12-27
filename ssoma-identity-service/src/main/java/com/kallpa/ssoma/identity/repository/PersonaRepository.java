package com.kallpa.ssoma.identity.repository;

import com.kallpa.ssoma.identity.domain.Persona;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PersonaRepository extends JpaRepository<Persona, Long> {

    @Query("SELECT p FROM Persona p LEFT JOIN FETCH p.empresa WHERE p.tenantId = :tenantId")
    List<Persona> findByTenantIdWithEmpresa(@Param("tenantId") String tenantId);

    List<Persona> findByTenantId(String tenantId);

    @Query("SELECT p FROM Persona p LEFT JOIN FETCH p.empresa WHERE p.tenantId = :tenantId AND p.personaId = :personaId")
    Optional<Persona> findByTenantIdAndPersonaIdWithEmpresa(@Param("tenantId") String tenantId, @Param("personaId") Long personaId);

    Optional<Persona> findByTenantIdAndPersonaId(String tenantId, Long personaId);

    Optional<Persona> findByNumeroDocumento(String numeroDocumento);

    List<Persona> findByTenantIdAndEstado(String tenantId, String estado);

    List<Persona> findByTenantIdAndEmpresaId(String tenantId, Long empresaId);

    @Query("SELECT p FROM Persona p WHERE p.tenantId = :tenantId AND " +
           "(LOWER(p.nombres) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(p.apellidos) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "p.numeroDocumento LIKE CONCAT('%', :searchTerm, '%') OR " +
           "LOWER(p.cargo) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
    List<Persona> searchPersonas(@Param("tenantId") String tenantId,
                                  @Param("searchTerm") String searchTerm);

    boolean existsByNumeroDocumento(String numeroDocumento);

    long countByTenantIdAndEstado(String tenantId, String estado);
}
