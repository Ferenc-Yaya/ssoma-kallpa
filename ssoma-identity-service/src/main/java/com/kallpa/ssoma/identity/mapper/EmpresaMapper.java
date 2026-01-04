package com.kallpa.ssoma.identity.mapper;

import com.kallpa.ssoma.identity.domain.Empresa;
import com.kallpa.ssoma.identity.domain.EmpresaContacto;
import com.kallpa.ssoma.identity.dto.request.CreateEmpresaRequest;
import com.kallpa.ssoma.identity.dto.EmpresaContactoDTO;
import com.kallpa.ssoma.identity.dto.EmpresaDTO;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring")
public interface EmpresaMapper {

    // Entity -> DTO
    @Mapping(source = "empresaId", target = "id")
    @Mapping(source = "tipoContratista.nombre", target = "tipoNombre")
    EmpresaDTO toDTO(Empresa empresa);

    List<EmpresaDTO> toDTOList(List<Empresa> empresas);

    // CreateRequest -> Entity
    @Mapping(target = "empresaId", ignore = true)
    @Mapping(target = "tenantId", ignore = true) // Se asigna en el service
    @Mapping(target = "tipoContratista", ignore = true)
    @Mapping(target = "contactos", ignore = true) // Se maneja aparte
    @Mapping(target = "createdAt", ignore = true)
    Empresa toEntity(CreateEmpresaRequest request);

    // Contacto mappings
    @Mapping(source = "contactoId", target = "id")
    EmpresaContactoDTO toContactoDTO(EmpresaContacto contacto);

    List<EmpresaContactoDTO> toContactoDTOList(List<EmpresaContacto> contactos);

    @Mapping(target = "contactoId", ignore = true)
    @Mapping(target = "tenantId", ignore = true)
    @Mapping(target = "empresa", ignore = true)
    EmpresaContacto toContactoEntity(EmpresaContactoDTO dto);
}
