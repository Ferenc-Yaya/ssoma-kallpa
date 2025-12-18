import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
import { NotificacionesService } from '../../core/services/notificaciones.service';
import { Notificacion } from '../../mocks/notificaciones.mock';

@Component({
  selector: 'app-notificaciones',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatBadgeModule,
    MatMenuModule
  ],
  templateUrl: './notificaciones.html',
  styleUrl: './notificaciones.scss'
})
export class NotificacionesComponent implements OnInit {
  notificaciones: Notificacion[] = [];
  countNoLeidas: number = 0;

  constructor(
    private notificacionesService: NotificacionesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.notificacionesService.getNotificaciones().subscribe(notificaciones => {
      this.notificaciones = notificaciones;
      this.countNoLeidas = this.notificacionesService.getCountNoLeidas();
    });
  }

  verNotificacion(notificacion: Notificacion): void {
    this.notificacionesService.marcarComoLeida(notificacion.id);
    if (notificacion.url) {
      this.router.navigate([notificacion.url]);
    }
  }

  marcarTodasComoLeidas(): void {
    this.notificacionesService.marcarTodasComoLeidas();
  }

  eliminarNotificacion(event: Event, id: number): void {
    event.stopPropagation();
    this.notificacionesService.eliminarNotificacion(id);
  }

  getTimeAgo(fecha: string): string {
    const ahora = new Date();
    const fechaNotif = new Date(fecha);
    const diff = ahora.getTime() - fechaNotif.getTime();
    
    const minutos = Math.floor(diff / 60000);
    const horas = Math.floor(diff / 3600000);
    const dias = Math.floor(diff / 86400000);

    if (minutos < 60) return `Hace ${minutos} min`;
    if (horas < 24) return `Hace ${horas}h`;
    return `Hace ${dias}d`;
  }
}