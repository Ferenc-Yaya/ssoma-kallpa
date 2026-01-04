package com.kallpa.ssoma.identity.service;

import com.kallpa.ssoma.identity.domain.Rol;
import com.kallpa.ssoma.identity.domain.Usuario;
import com.kallpa.ssoma.identity.dto.UsuarioDTO;
import com.kallpa.ssoma.identity.dto.request.ChangePasswordRequest;
import com.kallpa.ssoma.identity.dto.request.CreateUsuarioRequest;
import com.kallpa.ssoma.identity.dto.request.UpdateUsuarioRequest;
import com.kallpa.ssoma.identity.repository.RolRepository;
import com.kallpa.ssoma.identity.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Transactional(readOnly = true)
    public List<UsuarioDTO> getAllUsuarios() {
        return usuarioRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public UsuarioDTO getUsuarioById(UUID id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + id));
        return toDTO(usuario);
    }

    @Transactional
    public UsuarioDTO createUsuario(CreateUsuarioRequest request) {
        // Validar username único
        if (usuarioRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("El username ya existe: " + request.getUsername());
        }

        // Validar email único
        if (usuarioRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("El email ya existe: " + request.getEmail());
        }

        // Buscar rol
        Rol rol = rolRepository.findById(request.getRolId())
                .orElseThrow(() -> new RuntimeException("Rol no encontrado con ID: " + request.getRolId()));

        // Crear usuario
        Usuario usuario = new Usuario();
        usuario.setPersonaId(request.getPersonaId());
        usuario.setUsername(request.getUsername());
        usuario.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        usuario.setNombreCompleto(request.getNombreCompleto());
        usuario.setEmail(request.getEmail());
        usuario.setRol(rol);
        usuario.setActivo(request.getActivo());

        Usuario savedUsuario = usuarioRepository.save(usuario);
        return toDTO(savedUsuario);
    }

    @Transactional
    public UsuarioDTO updateUsuario(UUID id, UpdateUsuarioRequest request) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + id));

        // Validar email único (excluyendo el usuario actual)
        if (request.getEmail() != null && !usuario.getEmail().equals(request.getEmail()) &&
                usuarioRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("El email ya existe: " + request.getEmail());
        }

        // Actualizar campos
        if (request.getPersonaId() != null) {
            usuario.setPersonaId(request.getPersonaId());
        }
        if (request.getNombreCompleto() != null) {
            usuario.setNombreCompleto(request.getNombreCompleto());
        }
        if (request.getEmail() != null) {
            usuario.setEmail(request.getEmail());
        }
        if (request.getRolId() != null) {
            Rol rol = rolRepository.findById(request.getRolId())
                    .orElseThrow(() -> new RuntimeException("Rol no encontrado con ID: " + request.getRolId()));
            usuario.setRol(rol);
        }
        if (request.getActivo() != null) {
            usuario.setActivo(request.getActivo());
        }

        Usuario updatedUsuario = usuarioRepository.save(usuario);
        return toDTO(updatedUsuario);
    }

    @Transactional
    public void deleteUsuario(UUID id) {
        if (!usuarioRepository.existsById(id)) {
            throw new RuntimeException("Usuario no encontrado con ID: " + id);
        }
        usuarioRepository.deleteById(id);
    }

    @Transactional
    public void changePassword(UUID id, ChangePasswordRequest request) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + id));

        usuario.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        usuarioRepository.save(usuario);
    }

    @Transactional
    public void toggleActivo(UUID id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + id));

        usuario.setActivo(!usuario.getActivo());
        usuarioRepository.save(usuario);
    }

    private UsuarioDTO toDTO(Usuario usuario) {
        UsuarioDTO dto = new UsuarioDTO();
        dto.setUsuarioId(usuario.getUsuarioId());
        dto.setPersonaId(usuario.getPersonaId());
        if (usuario.getPersona() != null) {
            dto.setPersonaNombre(usuario.getPersona().getNombreCompleto());
        }
        dto.setUsername(usuario.getUsername());
        dto.setNombreCompleto(usuario.getNombreCompleto());
        dto.setEmail(usuario.getEmail());
        dto.setTenantId(usuario.getTenantId());
        dto.setActivo(usuario.getActivo());
        dto.setUltimoAcceso(usuario.getUltimoAcceso());
        dto.setCreatedAt(usuario.getCreatedAt());

        if (usuario.getRol() != null) {
            dto.setRolId(usuario.getRol().getRolId());
            dto.setRolNombre(usuario.getRol().getNombreRol());
            dto.setRolCodigo(usuario.getRol().getCodigo());
        }

        return dto;
    }
}
