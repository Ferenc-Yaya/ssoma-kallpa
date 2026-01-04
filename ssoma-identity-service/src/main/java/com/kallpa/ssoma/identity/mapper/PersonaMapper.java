package com.kallpa.ssoma.identity.mapper;

import com.kallpa.ssoma.identity.domain.Persona;
import com.kallpa.ssoma.identity.dto.request.CreatePersonaRequest;
import com.kallpa.ssoma.identity.dto.PersonaDTO;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring")
public interface PersonaMapper {

    // Entity -> DTO
    @Mapping(source = "personaId", target = "id")
    @Mapping(source = "empresa.razonSocial", target = "empresaNombre")
    @Mapping(target = "nombreCompleto", expression = "java(persona.getNombreCompleto())")
    PersonaDTO toDTO(Persona persona);

    List<PersonaDTO> toDTOList(List<Persona> personas);

    // CreateRequest -> Entity
    @Mapping(target = "personaId", ignore = true)
    @Mapping(target = "tenantId", ignore = true)
    @Mapping(target = "empresa", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "estadoGlobal", defaultValue = "ACTIVO")
    @Mapping(target = "esConductor", defaultValue = "false")
    @Mapping(target = "tipoDocumento", defaultValue = "DNI")
    Persona toEntity(CreatePersonaRequest request);
}
