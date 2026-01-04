package com.kallpa.ssoma.identity.mapper;

import com.kallpa.ssoma.identity.domain.Contrato;
import com.kallpa.ssoma.identity.dto.ContratoDTO;
import com.kallpa.ssoma.identity.dto.request.CreateContratoRequest;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ContratoMapper {

    // Entity -> DTO
    @Mapping(source = "contratoId", target = "id")
    @Mapping(source = "empresa.razonSocial", target = "empresaNombre")
    @Mapping(target = "actividadesCriticas", expression = "java(objectToString(contrato.getActividadesCriticas()))")
    ContratoDTO toDTO(Contrato contrato);

    List<ContratoDTO> toDTOList(List<Contrato> contratos);

    // CreateRequest -> Entity
    @Mapping(target = "contratoId", ignore = true)
    @Mapping(target = "tenantId", ignore = true)
    @Mapping(target = "empresa", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "estado", defaultValue = "ACTIVO")
    @Mapping(target = "nivelRiesgo", defaultValue = "MEDIO")
    Contrato toEntity(CreateContratoRequest request);

    // Método helper para convertir Object -> String
    default String objectToString(Object obj) {
        return obj != null ? obj.toString() : null;
    }
}
