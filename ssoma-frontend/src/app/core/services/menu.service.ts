import { Injectable } from '@angular/core';
import { MENU_ITEMS, MenuItem } from '../config/menu-config';
import { AuthService } from './auth';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  
  constructor(private authService: AuthService) {}

  getMenuItemsForCurrentUser(): MenuItem[] {
    const userRole = this.authService.getRole();
    
    if (!userRole) {
      return [];
    }

    // Filtrar items según el rol del usuario
    return MENU_ITEMS.filter(item => 
      item.roles.includes(userRole)
    );
  }

  hasAccessToRoute(route: string): boolean {
    const menuItems = this.getMenuItemsForCurrentUser();
    return menuItems.some(item => item.route === route);
  }
}