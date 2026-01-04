package com.kallpa.ssoma.identity.mapper;

import com.kallpa.ssoma.identity.domain.Rol;
import com.kallpa.ssoma.identity.dto.request.CreateRolRequest;
import com.kallpa.ssoma.identity.dto.RolDTO;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring")
public interface RolMapper {

    // Entity -> DTO
    @Mapping(source = "nombreRol", target = "nombre")
    @Mapping(target = "permisos", expression = "java(permisosToString(rol.getPermisos()))")
    @Mapping(target = "cantidadUsuarios", ignore = true) // Se calcula en el service
    RolDTO toDTO(Rol rol);

    List<RolDTO> toDTOList(List<Rol> roles);

    // CreateRequest -> Entity
    @Mapping(target = "rolId", ignore = true)
    @Mapping(target = "tenantId", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "activo", defaultValue = "true")
    @Mapping(target = "requiereTenant", defaultValue = "true")
    Rol toEntity(CreateRolRequest request);

    // Método helper para convertir Object -> String
    default String permisosToString(Object permisos) {
        return permisos != null ? permisos.toString() : null;
    }
}
