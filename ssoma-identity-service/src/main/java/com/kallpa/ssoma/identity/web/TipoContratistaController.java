package com.kallpa.ssoma.identity.web;

import com.kallpa.ssoma.identity.dto.TipoContratistaDTO;
import com.kallpa.ssoma.identity.service.TipoContratistaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/tipos-contratista")
@RequiredArgsConstructor
public class TipoContratistaController {

    private final TipoContratistaService tipoContratistaService;

    @GetMapping
    public ResponseEntity<List<TipoContratistaDTO>> getAllTipos() {
        List<TipoContratistaDTO> tipos = tipoContratistaService.findAll();
        return ResponseEntity.ok(tipos);
    }
}
