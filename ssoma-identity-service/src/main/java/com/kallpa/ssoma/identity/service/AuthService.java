package com.kallpa.ssoma.identity.service;

import com.kallpa.ssoma.identity.domain.Usuario;
import com.kallpa.ssoma.identity.dto.LoginRequest;
import com.kallpa.ssoma.identity.dto.LoginResponse;
import com.kallpa.ssoma.identity.repository.UsuarioRepository;
import com.kallpa.ssoma.shared.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final PasswordEncoder passwordEncoder;

    public LoginResponse login(LoginRequest request) {

        // 1. Buscar usuario por username
        Usuario usuario = usuarioRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // 2. Verificar que esté activo
        if (!usuario.getActivo()) {
            throw new RuntimeException("Usuario inactivo");
        }

        // 3. Validar contraseña
        if (!passwordEncoder.matches(request.getPassword(), usuario.getPasswordHash())) {
            throw new RuntimeException("Contraseña incorrecta");
        }

        // 4. Generar Token JWT con tenantId incluido
        String token = jwtTokenProvider.generateToken(
                usuario.getUsername(),
                usuario.getTenantId(),
                usuario.getRol() != null ? usuario.getRol().getNombreRol() : "USER"
        );

        // 5. Actualizar último acceso
        usuario.setUltimoAcceso(LocalDateTime.now());
        usuarioRepository.save(usuario);

        // 6. Retornar respuesta
        return new LoginResponse(
                token,
                usuario.getUsername(),
                usuario.getTenantId(),
                usuario.getRol() != null ? usuario.getRol().getNombreRol() : "USER",
                "Login exitoso"
        );
    }
}