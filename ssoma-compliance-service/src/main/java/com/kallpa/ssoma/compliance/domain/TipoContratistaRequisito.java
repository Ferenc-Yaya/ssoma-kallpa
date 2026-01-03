package com.kallpa.ssoma.compliance.domain;

import com.kallpa.ssoma.shared.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.UUID;

@Data
@Entity
@Table(name = "tbl_tipo_contratista_requisitos",
        uniqueConstraints = @UniqueConstraint(columnNames = {"tipo_contratista_id", "categoria_requisito", "documento_requerible_id"}))
@EqualsAndHashCode(callSuper = true)
public class TipoContratistaRequisito extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "requisito_id", columnDefinition = "UUID")
    private UUID requisitoId;

    @Column(name = "tipo_contratista_id", nullable = false, columnDefinition = "UUID")
    private UUID tipoContratistaId;

    @Column(name = "categoria_requisito", nullable = false, length = 50)
    private String categoriaRequisito;

    @Column(name = "documento_requerible_id", nullable = false, columnDefinition = "UUID")
    private UUID documentoRequeribleId;

    @Column(name = "obligatorio")
    private Boolean obligatorio = true;

    @Column(name = "aplica")
    private Boolean aplica = true;
}
