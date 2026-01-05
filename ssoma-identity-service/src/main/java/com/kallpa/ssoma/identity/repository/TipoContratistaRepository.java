package com.kallpa.ssoma.identity.repository;

import com.kallpa.ssoma.identity.domain.TipoContratista;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TipoContratistaRepository extends JpaRepository<TipoContratista, UUID> {

    List<TipoContratista> findByTenantId(String tenantId);

    List<TipoContratista> findAllByOrderByNombreAsc();
}
