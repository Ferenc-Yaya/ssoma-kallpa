package com.kallpa.ssoma.identity.service;

import com.kallpa.ssoma.identity.domain.Empresa;
import com.kallpa.ssoma.identity.domain.EmpresaContacto;
import com.kallpa.ssoma.identity.dto.request.CreateEmpresaRequest;
import com.kallpa.ssoma.identity.dto.EmpresaDTO;
import com.kallpa.ssoma.identity.dto.request.UpdateEmpresaRequest;
import com.kallpa.ssoma.identity.mapper.EmpresaMapper;
import com.kallpa.ssoma.identity.repository.EmpresaRepository;
import com.kallpa.ssoma.shared.context.TenantContext;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmpresaService {

    private final EmpresaRepository empresaRepository;
    private final EmpresaMapper empresaMapper;

    @Transactional(readOnly = true)
    public List<EmpresaDTO> findAll() {
        String tenantId = TenantContext.getTenantId();
        log.debug("Buscando todas las empresas para tenant: {}", tenantId);

        // SUPER_ADMIN (tenant SYSTEM) puede ver empresas de todos los tenants
        if ("SYSTEM".equals(tenantId)) {
            log.info("SUPER_ADMIN: Buscando empresas de TODOS los tenants");
            List<Empresa> empresas = empresaRepository.findAllWithTipo();
            return empresaMapper.toDTOList(empresas);
        }

        List<Empresa> empresas = empresaRepository.findByTenantIdWithTipo(tenantId);
        return empresaMapper.toDTOList(empresas);
    }

    @Transactional(readOnly = true)
    public EmpresaDTO findById(UUID id) {
        String tenantId = TenantContext.getTenantId();
        log.debug("Buscando empresa {} para tenant: {}", id, tenantId);
        Empresa empresa = empresaRepository.findByTenantIdAndEmpresaIdWithTipo(tenantId, id)
                .orElseThrow(() -> new RuntimeException("Empresa no encontrada con ID: " + id));
        return empresaMapper.toDTO(empresa);
    }

    @Transactional
    public EmpresaDTO create(CreateEmpresaRequest request) {
        String tenantId = TenantContext.getTenantId();
        log.info("Creando nueva empresa con RUC: {} para tenant: {}", request.getRuc(), tenantId);

        // Validar RUC único
        if (empresaRepository.existsByRuc(request.getRuc())) {
            throw new RuntimeException("Ya existe una empresa con el RUC: " + request.getRuc());
        }

        // Usar mapper para conversión básica
        Empresa empresa = empresaMapper.toEntity(request);
        empresa.setTenantId(tenantId);

        // Valores por defecto
        if (empresa.getScoreSeguridad() == null) {
            empresa.setScoreSeguridad(100);
        }
        if (empresa.getActivo() == null) {
            empresa.setActivo(true);
        }

        // Agregar contactos si existen
        if (request.getContactos() != null) {
            request.getContactos().forEach(contactoDTO -> {
                EmpresaContacto contacto = empresaMapper.toContactoEntity(contactoDTO);
                contacto.setTenantId(tenantId);
                if (contacto.getTipoContacto() == null) {
                    contacto.setTipoContacto("GENERAL");
                }
                empresa.addContacto(contacto);
            });
        }

        Empresa savedEmpresa = empresaRepository.save(empresa);
        log.info("Empresa creada exitosamente con ID: {}", savedEmpresa.getEmpresaId());
        return empresaMapper.toDTO(savedEmpresa);
    }

    @Transactional
    public EmpresaDTO update(UUID id, UpdateEmpresaRequest request) {
        String tenantId = TenantContext.getTenantId();
        log.info("Actualizando empresa {} para tenant: {}", id, tenantId);

        Empresa empresa = empresaRepository.findByTenantIdAndEmpresaId(tenantId, id)
                .orElseThrow(() -> new RuntimeException("Empresa no encontrada con ID: " + id));

        // Actualizar solo campos no nulos
        if (request.getRazonSocial() != null) {
            empresa.setRazonSocial(request.getRazonSocial());
        }
        if (request.getTipoId() != null) {
            empresa.setTipoId(request.getTipoId());
        }
        if (request.getDireccion() != null) {
            empresa.setDireccion(request.getDireccion());
        }
        if (request.getTelefono() != null) {
            empresa.setTelefono(request.getTelefono());
        }
        if (request.getEmail() != null) {
            empresa.setEmail(request.getEmail());
        }
        if (request.getActivo() != null) {
            empresa.setActivo(request.getActivo());
        }
        if (request.getLogoUrl() != null) {
            empresa.setLogoUrl(request.getLogoUrl());
        }
        if (request.getSitioWeb() != null) {
            empresa.setSitioWeb(request.getSitioWeb());
        }
        if (request.getRubroComercial() != null) {
            empresa.setRubroComercial(request.getRubroComercial());
        }
        if (request.getScoreSeguridad() != null) {
            empresa.setScoreSeguridad(request.getScoreSeguridad());
        }

        // Actualizar contactos si se proporcionan
        if (request.getContactos() != null) {
            empresa.getContactos().clear();
            request.getContactos().forEach(contactoDTO -> {
                EmpresaContacto contacto = empresaMapper.toContactoEntity(contactoDTO);
                contacto.setTenantId(tenantId);
                if (contacto.getTipoContacto() == null) {
                    contacto.setTipoContacto("GENERAL");
                }
                empresa.addContacto(contacto);
            });
        }

        Empresa updatedEmpresa = empresaRepository.save(empresa);
        log.info("Empresa actualizada exitosamente: {}", id);
        return empresaMapper.toDTO(updatedEmpresa);
    }

    @Transactional
    public void delete(UUID id) {
        String tenantId = TenantContext.getTenantId();
        log.info("Eliminando empresa {} para tenant: {}", id, tenantId);

        Empresa empresa = empresaRepository.findByTenantIdAndEmpresaId(tenantId, id)
                .orElseThrow(() -> new RuntimeException("Empresa no encontrada con ID: " + id));

        empresaRepository.delete(empresa);
        log.info("Empresa eliminada exitosamente: {}", id);
    }

    @Transactional(readOnly = true)
    public List<EmpresaDTO> search(String searchTerm) {
        String tenantId = TenantContext.getTenantId();
        log.debug("Buscando empresas con término: {} para tenant: {}", searchTerm, tenantId);
        List<Empresa> empresas = empresaRepository.searchEmpresas(tenantId, searchTerm);
        return empresaMapper.toDTOList(empresas);
    }
}
