package com.kallpa.ssoma.identity.config;

import com.kallpa.ssoma.identity.domain.Rol;
import com.kallpa.ssoma.identity.domain.Usuario;
import com.kallpa.ssoma.identity.repository.RolRepository;
import com.kallpa.ssoma.identity.repository.UsuarioRepository;
import com.kallpa.ssoma.shared.context.TenantContext;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {

        try {
            log.info("🔧 Inicializando datos del sistema...");

            // Crear SUPERADMIN esencial (si no existe)
            crearSuperAdmin();

            log.info("✅ Datos iniciales del sistema creados exitosamente");

        } finally {
            TenantContext.clear();
        }
    }

    private void crearSuperAdmin() {
        TenantContext.setTenantId("SYSTEM");

        if (usuarioRepository.existsByUsername("superadmin")) {
            log.info("✅ Usuario superadmin ya existe");
            return;
        }

        // Crear rol SUPER_ADMIN
        Rol rolSuperAdmin = rolRepository.findByCodigo("SUPER_ADMIN")
                .orElseGet(() -> {
                    log.info("📝 Creando rol SUPER_ADMIN...");
                    Rol nuevoRol = new Rol();
                    nuevoRol.setTenantId("SYSTEM");
                    nuevoRol.setCodigo("SUPER_ADMIN");
                    nuevoRol.setNombreRol("Super Administrador");
                    nuevoRol.setDescripcion("Super Administrador del Sistema");
                    nuevoRol.setNivelJerarquia(1);
                    nuevoRol.setRequiereTenant(false);
                    nuevoRol.setActivo(true);
                    return rolRepository.save(nuevoRol);
                });

        // Crear usuario superadmin
        Usuario superadmin = new Usuario();
        superadmin.setTenantId("SYSTEM");
        superadmin.setUsername("superadmin");
        superadmin.setPasswordHash(passwordEncoder.encode("admin123"));
        superadmin.setNombreCompleto("Super Administrador");
        superadmin.setEmail("admin@ssoma.com");
        superadmin.setRol(rolSuperAdmin);
        superadmin.setActivo(true);
        usuarioRepository.save(superadmin);

        log.info("✅ Usuario superadmin creado (SYSTEM / admin123)");
    }
}