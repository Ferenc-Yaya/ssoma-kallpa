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
            log.info("🔧 Inicializando datos por defecto...");

            // 1. CREAR USUARIO SUPERADMIN (SYSTEM)
            crearSuperAdmin();

            // 2. CREAR USUARIO ADMIN KALLPA
            crearAdminKallpa();

            // 3. CREAR USUARIO CONTRATISTA
            crearContratista();

            log.info("✅ Datos iniciales creados exitosamente");

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
        Rol rolSuperAdmin = rolRepository.findByTenantIdAndNombreRol("SYSTEM", "SUPER_ADMIN")
                .orElseGet(() -> {
                    log.info("📝 Creando rol SUPER_ADMIN...");
                    Rol nuevoRol = new Rol();
                    nuevoRol.setTenantId("SYSTEM");
                    nuevoRol.setNombreRol("SUPER_ADMIN");
                    nuevoRol.setDescripcion("Super Administrador del Sistema");
                    return rolRepository.save(nuevoRol);
                });

        // Crear usuario superadmin
        Usuario superadmin = new Usuario();
        superadmin.setTenantId("SYSTEM");
        superadmin.setUsername("superadmin");
        superadmin.setPasswordHash(passwordEncoder.encode("admin123"));
        superadmin.setEmail("admin@ssoma.com");
        superadmin.setRol(rolSuperAdmin);
        superadmin.setActivo(true);
        usuarioRepository.save(superadmin);

        log.info("✅ Usuario superadmin creado (SYSTEM / admin123)");
    }

    private void crearAdminKallpa() {
        TenantContext.setTenantId("KALLPA");

        if (usuarioRepository.existsByUsername("admin.kallpa")) {
            log.info("✅ Usuario admin.kallpa ya existe");
            return;
        }

        // Crear rol ADMIN_EMPRESA_PRINCIPAL
        Rol rolAdmin = rolRepository.findByTenantIdAndNombreRol("KALLPA", "ADMIN_EMPRESA_PRINCIPAL")
                .orElseGet(() -> {
                    log.info("📝 Creando rol ADMIN_EMPRESA_PRINCIPAL...");
                    Rol nuevoRol = new Rol();
                    nuevoRol.setTenantId("KALLPA");
                    nuevoRol.setNombreRol("ADMIN_EMPRESA_PRINCIPAL");
                    nuevoRol.setDescripcion("Administrador de la Empresa Principal");
                    return rolRepository.save(nuevoRol);
                });

        // Crear usuario admin.kallpa
        Usuario adminKallpa = new Usuario();
        adminKallpa.setTenantId("KALLPA");
        adminKallpa.setUsername("admin.kallpa");
        adminKallpa.setPasswordHash(passwordEncoder.encode("kallpa123"));
        adminKallpa.setEmail("admin@kallpa.com");
        adminKallpa.setRol(rolAdmin);
        adminKallpa.setActivo(true);
        usuarioRepository.save(adminKallpa);

        log.info("✅ Usuario admin.kallpa creado (KALLPA / kallpa123)");
    }

    private void crearContratista() {
        TenantContext.setTenantId("KALLPA");

        if (usuarioRepository.existsByUsername("jperez")) {
            log.info("✅ Usuario jperez ya existe");
            return;
        }

        // Crear rol ADMIN_CONTRATISTA
        Rol rolContratista = rolRepository.findByTenantIdAndNombreRol("KALLPA", "ADMIN_CONTRATISTA")
                .orElseGet(() -> {
                    log.info("📝 Creando rol ADMIN_CONTRATISTA...");
                    Rol nuevoRol = new Rol();
                    nuevoRol.setTenantId("KALLPA");
                    nuevoRol.setNombreRol("ADMIN_CONTRATISTA");
                    nuevoRol.setDescripcion("Administrador de Empresa Contratista");
                    return rolRepository.save(nuevoRol);
                });

        // Crear usuario jperez
        Usuario contratista = new Usuario();
        contratista.setTenantId("KALLPA");
        contratista.setUsername("jperez");
        contratista.setPasswordHash(passwordEncoder.encode("contratista123"));
        contratista.setEmail("jperez@contratista.com");
        contratista.setRol(rolContratista);
        contratista.setActivo(true);
        usuarioRepository.save(contratista);

        log.info("✅ Usuario jperez creado (KALLPA / contratista123)");
    }
}