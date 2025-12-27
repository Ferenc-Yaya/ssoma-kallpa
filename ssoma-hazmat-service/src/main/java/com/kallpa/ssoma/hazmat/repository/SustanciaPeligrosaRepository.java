package com.kallpa.ssoma.hazmat.repository;

import com.kallpa.ssoma.hazmat.domain.SustanciaPeligrosa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SustanciaPeligrosaRepository extends JpaRepository<SustanciaPeligrosa, Long> {

    List<SustanciaPeligrosa> findByTenantId(String tenantId);

    @Query("SELECT s FROM SustanciaPeligrosa s WHERE s.tenantId = :tenantId AND " +
            "(LOWER(s.nombre) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(s.codigoUn) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(s.clasePeligro) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
    List<SustanciaPeligrosa> searchByTenantId(@Param("tenantId") String tenantId,
                                               @Param("searchTerm") String searchTerm);

    List<SustanciaPeligrosa> findByTenantIdAndClasePeligro(String tenantId, String clasePeligro);
}
