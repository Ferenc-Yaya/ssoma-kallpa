import { Injectable } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter } from 'rxjs';

export interface Breadcrumb {
  label: string;
  url: string;
}

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbsService {
  private breadcrumbsSubject = new BehaviorSubject<Breadcrumb[]>([]);
  public breadcrumbs$: Observable<Breadcrumb[]> = this.breadcrumbsSubject.asObservable();

  private routeLabels: { [key: string]: string } = {
    'dashboard': 'Dashboard',
    'empresas': 'Empresas',
    'acreditacion': 'Acreditación',
    'pasaporte': 'Pasaporte Digital',
    'mi-empresa': 'Mi Empresa',
    'mi-personal': 'Mi Personal',
    'mis-documentos': 'Mis Documentos'
  };

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.buildBreadcrumbs();
      });
  }

  private buildBreadcrumbs(): void {
    const breadcrumbs: Breadcrumb[] = [
      { label: 'Inicio', url: '/' }
    ];

    const url = this.router.url;
    const urlSegments = url.split('/').filter(segment => segment);

    let currentUrl = '';
    
    urlSegments.forEach((segment, index) => {
      currentUrl += `/${segment}`;
      
      // Si es un número (ID), usar el label del segmento anterior + "Detalle"
      if (!isNaN(Number(segment))) {
        breadcrumbs.push({
          label: 'Detalle',
          url: currentUrl
        });
      } else {
        const label = this.routeLabels[segment] || this.capitalizeFirst(segment);
        breadcrumbs.push({
          label: label,
          url: currentUrl
        });
      }
    });

    this.breadcrumbsSubject.next(breadcrumbs);
  }

  private capitalizeFirst(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  public updateBreadcrumbs(breadcrumbs: Breadcrumb[]): void {
    this.breadcrumbsSubject.next(breadcrumbs);
  }
}