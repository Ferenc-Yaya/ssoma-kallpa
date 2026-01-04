package com.kallpa.ssoma.identity.mapper;

import com.kallpa.ssoma.identity.domain.Sede;
import com.kallpa.ssoma.identity.dto.SedeDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface SedeMapper {

    // Entity -> DTO
    @Mapping(source = "sedeId", target = "id")
    SedeDTO toDTO(Sede sede);

    List<SedeDTO> toDTOList(List<Sede> sedes);

    // DTO -> Entity (para crear)
    @Mapping(target = "sedeId", ignore = true)
    @Mapping(target = "tenantId", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    Sede toEntity(SedeDTO dto);
}
