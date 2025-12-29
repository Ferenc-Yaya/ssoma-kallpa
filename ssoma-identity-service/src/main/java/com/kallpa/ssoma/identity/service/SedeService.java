package com.kallpa.ssoma.identity.service;

import com.kallpa.ssoma.identity.domain.Sede;
import com.kallpa.ssoma.identity.dto.SedeDTO;
import com.kallpa.ssoma.identity.repository.SedeRepository;
import com.kallpa.ssoma.shared.context.TenantContext;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class SedeService {

    private final SedeRepository sedeRepository;

    @Transactional(readOnly = true)
    public List<SedeDTO> findByEmpresaId(UUID empresaId) {
        String tenantId = TenantContext.getTenantId();
        log.debug("Buscando sedes para empresa {} y tenant: {}", empresaId, tenantId);

        // SUPER_ADMIN puede ver sedes de cualquier tenant
        List<Sede> sedes;
        if ("SYSTEM".equals(tenantId)) {
            log.info("SUPER_ADMIN: Buscando sedes para empresa {} en TODOS los tenants", empresaId);
            sedes = sedeRepository.findAll().stream()
                    .filter(s -> s.getEmpresaId().equals(empresaId))
                    .collect(Collectors.toList());
        } else {
            sedes = sedeRepository.findByTenantIdAndEmpresaId(tenantId, empresaId);
        }

        return sedes.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public long countByEmpresaId(UUID empresaId) {
        String tenantId = TenantContext.getTenantId();

        if ("SYSTEM".equals(tenantId)) {
            return sedeRepository.findAll().stream()
                    .filter(s -> s.getEmpresaId().equals(empresaId))
                    .count();
        }

        return sedeRepository.countByTenantIdAndEmpresaId(tenantId, empresaId);
    }

    private SedeDTO toDTO(Sede sede) {
        SedeDTO dto = new SedeDTO();
        dto.setId(sede.getSedeId());
        dto.setEmpresaId(sede.getEmpresaId());
        dto.setTenantId(sede.getTenantId());
        dto.setNombre(sede.getNombre());
        dto.setDireccion(sede.getDireccion());
        dto.setEsPrincipal(sede.getEsPrincipal());
        dto.setActivo(sede.getActivo());
        dto.setCreatedAt(sede.getCreatedAt());
        return dto;
    }
}
