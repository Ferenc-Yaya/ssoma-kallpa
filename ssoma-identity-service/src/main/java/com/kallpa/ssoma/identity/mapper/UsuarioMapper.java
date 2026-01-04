package com.kallpa.ssoma.identity.mapper;

import com.kallpa.ssoma.identity.domain.Usuario;
import com.kallpa.ssoma.identity.dto.request.CreateUsuarioRequest;
import com.kallpa.ssoma.identity.dto.UsuarioDTO;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring")
public interface UsuarioMapper {

    // Entity -> DTO
    @Mapping(source = "persona.nombreCompleto", target = "personaNombre")
    @Mapping(source = "rol.rolId", target = "rolId")
    @Mapping(source = "rol.nombreRol", target = "rolNombre")
    @Mapping(source = "rol.codigo", target = "rolCodigo")
    @Mapping(target = "empresaNombre", ignore = true) // Se puede calcular si es necesario
    UsuarioDTO toDTO(Usuario usuario);

    List<UsuarioDTO> toDTOList(List<Usuario> usuarios);

    // CreateRequest -> Entity
    @Mapping(target = "usuarioId", ignore = true)
    @Mapping(target = "tenantId", ignore = true)
    @Mapping(target = "passwordHash", ignore = true) // Se encripta en el service
    @Mapping(target = "persona", ignore = true)
    @Mapping(target = "rol", ignore = true) // Se busca en el service
    @Mapping(target = "ultimoAcceso", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    Usuario toEntity(CreateUsuarioRequest request);
}
