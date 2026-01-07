package com.kallpa.ssoma.identity.service;

import com.kallpa.ssoma.identity.domain.Empresa;
import com.kallpa.ssoma.identity.domain.EmpresaContacto;
import com.kallpa.ssoma.identity.domain.Tenant;
import com.kallpa.ssoma.identity.domain.TipoContratista;
import com.kallpa.ssoma.identity.dto.request.CreateEmpresaRequest;
import com.kallpa.ssoma.identity.dto.EmpresaDTO;
import com.kallpa.ssoma.identity.dto.request.UpdateEmpresaRequest;
import com.kallpa.ssoma.identity.mapper.EmpresaMapper;
import com.kallpa.ssoma.identity.repository.EmpresaRepository;
import com.kallpa.ssoma.identity.repository.TenantRepository;
import com.kallpa.ssoma.identity.repository.TipoContratistaRepository;
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
    private final TenantRepository tenantRepository;
    private final TipoContratistaRepository tipoContratistaRepository;

    @Transactional(readOnly = true)
    public List<EmpresaDTO> findAll(String targetTenantId) {
        String contextTenantId = TenantContext.getTenantId();
        log.debug("Buscando empresas. Contexto: {}, Objetivo: {}", contextTenantId, targetTenantId);

        // CASO 1: Eres SUPER_ADMIN y quieres ver los datos de un tenant específico (TU CASO ACTUAL)
        if ("SYSTEM".equals(contextTenantId) && targetTenantId != null && !targetTenantId.isBlank()) {
            log.info("SUPER_ADMIN: Filtrando empresas específicamente del tenant: {}", targetTenantId);
            List<Empresa> empresas = empresaRepository.findByTenantIdWithTipo(targetTenantId);
            return empresaMapper.toDTOList(empresas);
        }

        // CASO 2: Eres SUPER_ADMIN y quieres ver TODO (Pantalla general)
        if ("SYSTEM".equals(contextTenantId)) {
            log.info("SUPER_ADMIN: Buscando empresas de TODOS los tenants");
            List<Empresa> empresas = empresaRepository.findAllWithTipo();
            return empresaMapper.toDTOList(empresas);
        }

        // CASO 3: Usuario normal (solo ve su propia data)
        List<Empresa> empresas = empresaRepository.findByTenantIdWithTipo(contextTenantId);
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
        // -------------------------------------------------------------------------
        // 1. DETERMINAR TENANT DESTINO
        // -------------------------------------------------------------------------
        // La regla de oro: Si el request trae un tenantId (ej. generado por el frontend
        // al escribir la Razón Social), ese tiene prioridad absoluta sobre el token (SYSTEM).
        String tenantId;
        if (request.getTenantId() != null && !request.getTenantId().isBlank()) {
            tenantId = request.getTenantId();
            log.info("Creando empresa con Tenant ID explícito: {}", tenantId);
        } else {
            tenantId = TenantContext.getTenantId();
            log.info("Creando empresa asignada al Tenant del contexto actual: {}", tenantId);
        }

        log.info("Iniciando creación de empresa. RUC: {}, Target Tenant: {}", request.getRuc(), tenantId);

        // -------------------------------------------------------------------------
        // 2. VALIDACIONES PREVIAS
        // -------------------------------------------------------------------------
        // Validar RUC único (Asegúrate que tu repositorio soporte buscar por RUC globalmente o filtrado según tu lógica)
        if (empresaRepository.existsByRuc(request.getRuc())) {
            throw new RuntimeException("Ya existe una empresa con el RUC: " + request.getRuc());
        }

        // -------------------------------------------------------------------------
        // 3. LOGICA DE EMPRESA PRINCIPAL (HOST)
        // -------------------------------------------------------------------------
        // Si es una empresa principal, verificamos si necesitamos crear su espacio (Tenant) en la tabla tbl_tenants
        if (request.getTipoId() != null) {
            TipoContratista tipo = tipoContratistaRepository.findById(request.getTipoId()).orElse(null);

            // Verificamos por código o nombre si es tipo HOST
            if (tipo != null && ("HOST".equals(tipo.getCodigo()) || "Empresa Principal".equals(tipo.getNombre()))) {
                // Es Principal: Verificar y crear el registro en tbl_tenants si no existe
                if (!tenantRepository.existsByTenantId(tenantId)) {
                    log.info("El tenant '{}' no existe. Creando nuevo registro de Tenant...", tenantId);
                    Tenant newTenant = new Tenant();
                    newTenant.setTenantId(tenantId);
                    newTenant.setActivo(true);
                    // La fecha se pone sola por el @PrePersist de Tenant
                    tenantRepository.save(newTenant);
                    log.info("Tenant '{}' creado exitosamente.", tenantId);
                }
            }
        }

        // -------------------------------------------------------------------------
        // 4. MAPEO Y ASIGNACIÓN
        // -------------------------------------------------------------------------
        Empresa empresa = empresaMapper.toEntity(request);

        // ¡PUNTO CRÍTICO!
        // Asignamos manualmente el tenantId calculado arriba.
        // Esto asegura que la empresa pertenezca a "minera-x" y no a "SYSTEM".
        empresa.setTenantId(tenantId);

        // Valores por defecto si vienen nulos
        if (empresa.getScoreSeguridad() == null) {
            empresa.setScoreSeguridad(100);
        }
        if (empresa.getActivo() == null) {
            empresa.setActivo(true);
        }

        // -------------------------------------------------------------------------
        // 5. PROCESAR CONTACTOS
        // -------------------------------------------------------------------------
        if (request.getContactos() != null) {
            request.getContactos().forEach(contactoDTO -> {
                EmpresaContacto contacto = empresaMapper.toContactoEntity(contactoDTO);
                // Los contactos deben heredar el mismo tenant de la empresa padre
                contacto.setTenantId(tenantId);

                if (contacto.getTipoContacto() == null) {
                    contacto.setTipoContacto("GENERAL");
                }
                empresa.addContacto(contacto);
            });
        }

        // -------------------------------------------------------------------------
        // 6. GUARDAR Y RETORNAR
        // -------------------------------------------------------------------------
        // Al guardar, el Listener de BaseEntity verá que 'tenantId' ya tiene valor
        // y NO lo sobrescribirá con 'SYSTEM'.
        Empresa savedEmpresa = empresaRepository.save(empresa);

        log.info("Empresa creada exitosamente con ID: {} en Tenant: {}", savedEmpresa.getEmpresaId(), savedEmpresa.getTenantId());

        return empresaMapper.toDTO(savedEmpresa);
    }

    @Transactional
    public EmpresaDTO update(UUID id, UpdateEmpresaRequest request) {
        String tenantId = TenantContext.getTenantId();
        log.info("Actualizando empresa {} para tenant: {}", id, tenantId);
        log.info("UPDATE Empresa -> tenantId='{}', empresaId='{}'", tenantId, id);

        // Buscar por ID directamente sin filtrar por tenant (permite que superadmin edite cualquier empresa)
        Empresa empresa = empresaRepository.findById(id)
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

        // Buscar por ID directamente sin filtrar por tenant (permite que superadmin elimine cualquier empresa)
        Empresa empresa = empresaRepository.findById(id)
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
