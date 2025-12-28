package com.kallpa.ssoma.identity.web;

import com.kallpa.ssoma.identity.dto.CreateRolRequest;
import com.kallpa.ssoma.identity.dto.RolDTO;
import com.kallpa.ssoma.identity.dto.UpdateRolRequest;
import com.kallpa.ssoma.identity.service.RolService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/roles")
@RequiredArgsConstructor
public class RolController {

    private final RolService rolService;

    @GetMapping
    public ResponseEntity<List<RolDTO>> getAllRoles() {
        try {
            List<RolDTO> roles = rolService.getAllRoles();
            return ResponseEntity.ok(roles);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<RolDTO> getRolById(@PathVariable UUID id) {
        try {
            RolDTO rol = rolService.getRolById(id);
            return ResponseEntity.ok(rol);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/codigo/{codigo}")
    public ResponseEntity<RolDTO> getRolByCodigo(@PathVariable String codigo) {
        try {
            RolDTO rol = rolService.getRolByCodigo(codigo);
            return ResponseEntity.ok(rol);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping
    public ResponseEntity<?> createRol(@Valid @RequestBody CreateRolRequest request) {
        try {
            RolDTO rol = rolService.createRol(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(rol);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Error al crear el rol"));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateRol(@PathVariable UUID id,
                                      @Valid @RequestBody UpdateRolRequest request) {
        try {
            RolDTO rol = rolService.updateRol(id, request);
            return ResponseEntity.ok(rol);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Error al actualizar el rol"));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRol(@PathVariable UUID id) {
        try {
            rolService.deleteRol(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Error al eliminar el rol"));
        }
    }

    @PutMapping("/{id}/toggle-activo")
    public ResponseEntity<?> toggleActivo(@PathVariable UUID id) {
        try {
            rolService.toggleActivo(id);
            return ResponseEntity.ok(new SuccessResponse("Estado del rol actualizado exitosamente"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Error al actualizar el estado"));
        }
    }

    // Response classes
    private record ErrorResponse(String message) {}
    private record SuccessResponse(String message) {}
}
