import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TenantService } from '../services/tenant';

export const tenantInterceptor: HttpInterceptorFn = (req, next) => {
  // No agregar X-Tenant-ID a endpoints de autenticación pública
  if (req.url.includes('/api/auth') || req.url.includes('/api/public')) {
    return next(req);
  }

  const tenantService = inject(TenantService);
  const tenantId = tenantService.getCurrentTenant();

  const clonedRequest = req.clone({
    setHeaders: {
      'X-Tenant-ID': tenantId
    }
  });

  return next(clonedRequest);
};