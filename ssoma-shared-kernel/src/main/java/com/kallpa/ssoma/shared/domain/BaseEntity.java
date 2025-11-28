package com.kallpa.ssoma.shared.domain;

import com.kallpa.ssoma.shared.context.TenantContext;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Data
@MappedSuperclass
@EntityListeners(BaseEntity.TenantListener.class)
public abstract class BaseEntity {

    @Column(name = "tenant_id", nullable = false, updatable = false)
    private String tenantId;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public static class TenantListener {
        @PrePersist
        public void setTenant(BaseEntity entity) {
            String tenant = TenantContext.getTenantId();
            if (tenant == null) {
                throw new IllegalStateException(
                        "ERROR CRÍTICO: Intentando guardar datos sin TenantContext (X-Tenant-ID faltante)."
                );
            }
            entity.setTenantId(tenant);
        }
    }
}