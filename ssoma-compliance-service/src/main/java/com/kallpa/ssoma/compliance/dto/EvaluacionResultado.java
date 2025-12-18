package com.kallpa.ssoma.compliance.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EvaluacionResultado {

    private Boolean esApto;
    private List<String> logs; // Mensajes de qué documentos faltan o están vencidos

    public String getSemaforo() {
        return esApto ? "VERDE" : "ROJO";
    }
}