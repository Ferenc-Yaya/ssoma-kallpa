package com.kallpa.ssoma.identity.service;

import com.kallpa.ssoma.identity.domain.TipoContratista;
import com.kallpa.ssoma.identity.dto.TipoContratistaDTO;
import com.kallpa.ssoma.identity.repository.TipoContratistaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TipoContratistaService {

    private final TipoContratistaRepository tipoContratistaRepository;

    @Transactional(readOnly = true)
    public List<TipoContratistaDTO> findAll() {
        return tipoContratistaRepository.findAllByOrderByNombreAsc()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    private TipoContratistaDTO toDTO(TipoContratista entity) {
        TipoContratistaDTO dto = new TipoContratistaDTO();
        dto.setTipoId(entity.getTipoId());
        dto.setCodigo(entity.getCodigo());
        dto.setNombre(entity.getNombre());
        dto.setDescripcion(entity.getDescripcion());
        return dto;
    }
}
