package com.kallpa.ssoma.hazmat.repository;

import com.kallpa.ssoma.hazmat.domain.InventarioMatpel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InventarioMatpelRepository extends JpaRepository<InventarioMatpel, Long> {

    List<InventarioMatpel> findByTenantId(String tenantId);

    List<InventarioMatpel> findByTenantIdAndEmpresaId(String tenantId, Long empresaId);

    List<InventarioMatpel> findByTenantIdAndSustanciaId(String tenantId, Long sustanciaId);

    List<InventarioMatpel> findByTenantIdAndEstado(String tenantId, String estado);

    @Query("SELECT i FROM InventarioMatpel i WHERE i.tenantId = :tenantId AND " +
            "(LOWER(i.sustancia.nombre) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(i.ubicacion) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(i.lote) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
    List<InventarioMatpel> searchByTenantId(@Param("tenantId") String tenantId,
                                            @Param("searchTerm") String searchTerm);
}
