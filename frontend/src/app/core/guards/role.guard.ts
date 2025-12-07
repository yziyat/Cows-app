import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
    constructor(
        private router: Router,
        private authService: AuthService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const allowedRoles = route.data['role'] as Array<string>;
        if (this.authService.hasRole(allowedRoles)) {
            return true;
        }

        // Not authorized
        this.router.navigate(['/']); // Go to home/dashboard if not authorized
        return false;
    }
}
