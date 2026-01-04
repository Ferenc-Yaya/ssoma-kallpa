package com.kallpa.ssoma.identity.service;

import com.kallpa.ssoma.identity.domain.Sede;
import com.kallpa.ssoma.identity.dto.SedeDTO;
import com.kallpa.ssoma.identity.mapper.SedeMapper;
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
    private final SedeMapper sedeMapper;

    // ---------------- Read ----------------
    @Transactional(readOnly = true)
    public List<SedeDTO> findByEmpresaId(UUID empresaId) {
        String tenantId = TenantContext.getTenantId();
        List<Sede> sedes;

        if ("SYSTEM".equals(tenantId)) {
            sedes = sedeRepository.findAll().stream()
                    .filter(s -> s.getEmpresaId().equals(empresaId))
                    .collect(Collectors.toList());
        } else {
            sedes = sedeRepository.findByTenantIdAndEmpresaId(tenantId, empresaId);
        }

        return sedes.stream()
                .map(sedeMapper::toDTO)
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

    @Transactional
    public SedeDTO createSede(SedeDTO dto) {
        Sede sede = sedeMapper.toEntity(dto);
        sede.setTenantId(TenantContext.getTenantId());
        if (sede.getEsPrincipal() == null) sede.setEsPrincipal(false);
        if (sede.getActivo() == null) sede.setActivo(true);

        Sede saved = sedeRepository.save(sede);
        return sedeMapper.toDTO(saved);
    }

    @Transactional
    public SedeDTO updateSede(UUID id, SedeDTO dto) {
        Sede sede = sedeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sede no encontrada"));

        // Validar tenant
        if (!TenantContext.getTenantId().equals("SYSTEM") &&
                !sede.getTenantId().equals(TenantContext.getTenantId())) {
            throw new RuntimeException("No autorizado para actualizar esta sede");
        }

        sede.setNombre(dto.getNombre());
        sede.setDireccion(dto.getDireccion());
        sede.setEsPrincipal(dto.getEsPrincipal() != null ? dto.getEsPrincipal() : false);
        sede.setActivo(dto.getActivo() != null ? dto.getActivo() : true);

        return sedeMapper.toDTO(sedeRepository.save(sede));
    }

    @Transactional
    public void deleteSede(UUID id) {
        Sede sede = sedeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sede no encontrada"));

        // Validar tenant
        if (!TenantContext.getTenantId().equals("SYSTEM") &&
                !sede.getTenantId().equals(TenantContext.getTenantId())) {
            throw new RuntimeException("No autorizado para eliminar esta sede");
        }

        sedeRepository.deleteById(id);
    }
}
