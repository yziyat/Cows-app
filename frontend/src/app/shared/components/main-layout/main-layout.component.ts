// src/app/shared/components/main-layout/main-layout.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent {
  sidenavOpened = true;

  menuItems = [
    { label: 'Tableau de bord', icon: 'dashboard', route: '/dashboard' },
    { label: 'Bovins', icon: 'pets', route: '/cattle' },
    { label: 'Cycles de synchro', icon: 'sync', route: '/cycles' },
    { label: 'Inséminations', icon: 'science', route: '/inseminations' },
    { label: 'Protocoles', icon: 'list', route: '/protocols' },
  ];

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  get currentUser() {
    return this.authService.currentUserValue;
  }
}
