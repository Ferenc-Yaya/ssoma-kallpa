package com.kallpa.ssoma.identity.service;

import com.kallpa.ssoma.identity.domain.Rol;
import com.kallpa.ssoma.identity.dto.request.CreateRolRequest;
import com.kallpa.ssoma.identity.dto.RolDTO;
import com.kallpa.ssoma.identity.dto.request.UpdateRolRequest;
import com.kallpa.ssoma.identity.repository.RolRepository;
import com.kallpa.ssoma.identity.repository.UsuarioRepository;
import com.kallpa.ssoma.shared.context.TenantContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RolService {

    private final RolRepository rolRepository;
    private final UsuarioRepository usuarioRepository;

    @Transactional(readOnly = true)
    public List<RolDTO> getAllRoles() {
        return rolRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public RolDTO getRolById(UUID id) {
        Rol rol = rolRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rol no encontrado con ID: " + id));
        return toDTO(rol);
    }

    @Transactional(readOnly = true)
    public RolDTO getRolByCodigo(String codigo) {
        Rol rol = rolRepository.findByCodigo(codigo)
                .orElseThrow(() -> new RuntimeException("Rol no encontrado con código: " + codigo));
        return toDTO(rol);
    }

    @Transactional
    public RolDTO createRol(CreateRolRequest request) {
        // Validar código único
        if (rolRepository.findByCodigo(request.getCodigo()).isPresent()) {
            throw new RuntimeException("El código de rol ya existe: " + request.getCodigo());
        }

        // Validar nombre único
        if (rolRepository.findByNombreRol(request.getNombreRol()).isPresent()) {
            throw new RuntimeException("El nombre de rol ya existe: " + request.getNombreRol());
        }

        // Crear rol
        String tenantId = TenantContext.getTenantId();
        Rol rol = new Rol();
        rol.setTenantId(tenantId);
        rol.setCodigo(request.getCodigo());
        rol.setNombreRol(request.getNombreRol());
        rol.setDescripcion(request.getDescripcion());
        rol.setNivelJerarquia(request.getNivelJerarquia());
        rol.setRequiereTenant(request.getRequiereTenant() != null ? request.getRequiereTenant() : true);
        rol.setPermisos(request.getPermisos());
        rol.setActivo(request.getActivo() != null ? request.getActivo() : true);

        Rol savedRol = rolRepository.save(rol);
        return toDTO(savedRol);
    }

    @Transactional
    public RolDTO updateRol(UUID id, UpdateRolRequest request) {
        Rol rol = rolRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rol no encontrado con ID: " + id));

        // Validar nombre único (excluyendo el rol actual)
        if (request.getNombreRol() != null && !rol.getNombreRol().equals(request.getNombreRol()) &&
                rolRepository.findByNombreRol(request.getNombreRol()).isPresent()) {
            throw new RuntimeException("El nombre de rol ya existe: " + request.getNombreRol());
        }

        // Actualizar campos (el código no se puede cambiar)
        if (request.getNombreRol() != null) {
            rol.setNombreRol(request.getNombreRol());
        }
        if (request.getDescripcion() != null) {
            rol.setDescripcion(request.getDescripcion());
        }
        if (request.getNivelJerarquia() != null) {
            rol.setNivelJerarquia(request.getNivelJerarquia());
        }
        if (request.getRequiereTenant() != null) {
            rol.setRequiereTenant(request.getRequiereTenant());
        }
        if (request.getPermisos() != null) {
            rol.setPermisos(request.getPermisos());
        }
        if (request.getActivo() != null) {
            rol.setActivo(request.getActivo());
        }

        Rol updatedRol = rolRepository.save(rol);
        return toDTO(updatedRol);
    }

    @Transactional
    public void deleteRol(UUID id) {
        Rol rol = rolRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rol no encontrado con ID: " + id));

        // Verificar si hay usuarios asignados a este rol
        long cantidadUsuarios = usuarioRepository.countByRol(rol);
        if (cantidadUsuarios > 0) {
            throw new RuntimeException("No se puede eliminar el rol porque tiene " + cantidadUsuarios + " usuario(s) asignado(s)");
        }

        rolRepository.deleteById(id);
    }

    @Transactional
    public void toggleActivo(UUID id) {
        Rol rol = rolRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rol no encontrado con ID: " + id));

        rol.setActivo(!rol.getActivo());
        rolRepository.save(rol);
    }

    private RolDTO toDTO(Rol rol) {
        RolDTO dto = new RolDTO();
        dto.setRolId(rol.getRolId());
        dto.setTenantId(rol.getTenantId());
        dto.setCodigo(rol.getCodigo());
        dto.setNombre(rol.getNombreRol());
        dto.setDescripcion(rol.getDescripcion());
        dto.setNivelJerarquia(rol.getNivelJerarquia());
        dto.setRequiereTenant(rol.getRequiereTenant());
        dto.setPermisos(rol.getPermisos() != null ? rol.getPermisos().toString() : null);
        dto.setActivo(rol.getActivo());
        dto.setCreatedAt(rol.getCreatedAt());

        // Contar usuarios con este rol
        long cantidadUsuarios = usuarioRepository.countByRol(rol);
        dto.setCantidadUsuarios(cantidadUsuarios);

        return dto;
    }
}
