package com.kallpa.ssoma.compliance.service;

import com.kallpa.ssoma.compliance.domain.ReglaNegocio;
import com.kallpa.ssoma.compliance.dto.EvaluacionResultado;
import com.kallpa.ssoma.compliance.repository.ReglaRepository;
import com.kallpa.ssoma.shared.context.TenantContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ComplianceEngine {

    private final ReglaRepository reglaRepository;

    /**
     * Evalúa si una persona cumple con todos los requisitos
     * @param categoria Tipo de evaluación: 'TRABAJADOR', 'VEHICULO', 'HERRAMIENTA'
     * @return Resultado con semáforo VERDE (apto) o ROJO (no apto)
     */
    public EvaluacionResultado evaluar(String categoria, Long entidadId) {

        String tenantId = TenantContext.getTenantId();

        // 1. Obtener las reglas del juego (BD)
        List<ReglaNegocio> reglas = reglaRepository
                .findByTenantIdAndCategoriaAndActivaTrue(tenantId, categoria);

        boolean esApto = true;
        List<String> logs = new ArrayList<>();

        // 2. Evaluar cada regla
        for (ReglaNegocio regla : reglas) {

            // Aquí iría la lógica de evaluación específica
            // Por ahora dejamos el esqueleto básico

            boolean cumpleRegla = evaluarRegla(regla, entidadId);

            if (!cumpleRegla) {
                esApto = false;
                logs.add(regla.getMensajeAlerta() != null
                        ? regla.getMensajeAlerta()
                        : "No cumple regla: " + regla.getNombreRegla());
            }
        }

        if (esApto) {
            logs.add("✓ Todos los requisitos cumplidos");
        }

        return new EvaluacionResultado(esApto, logs);
    }

    /**
     * Evalúa una regla específica
     * TODO: Implementar lógica de evaluación según tipo de regla
     */
    private boolean evaluarRegla(ReglaNegocio regla, Long entidadId) {

        // Aquí iría la lógica de evaluación:
        // - Buscar documentos asociados a la entidad
        // - Verificar fechas de vencimiento
        // - Verificar aprobaciones
        // - Evaluar la condición de la regla

        // Por ahora retornamos true (se implementará en siguientes fases)
        return true;
    }

    /**
     * Verifica si un documento está vencido
     */
    private boolean estaVencido(LocalDate fechaVencimiento) {
        return fechaVencimiento != null && fechaVencimiento.isBefore(LocalDate.now());
    }

    /**
     * Verifica si un documento está por vencer (menos de 30 días)
     */
    private boolean estaPorVencer(LocalDate fechaVencimiento) {
        if (fechaVencimiento == null) return false;

        LocalDate dentro30Dias = LocalDate.now().plusDays(30);
        return fechaVencimiento.isBefore(dentro30Dias) &&
                fechaVencimiento.isAfter(LocalDate.now());
    }
}