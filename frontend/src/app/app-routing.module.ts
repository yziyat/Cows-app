// src/app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { CattleListComponent } from './features/cattle/cattle-list/cattle-list.component';
import { CattleDetailComponent } from './features/cattle/cattle-detail/cattle-detail.component';
import { ProtocolListComponent } from './features/protocols/protocol-list/protocol-list.component';
import { CycleListComponent } from './features/cycles/cycle-list/cycle-list.component';
import { InseminationListComponent } from './features/inseminations/insemination-list/insemination-list.component';
import { MainLayoutComponent } from './shared/components/main-layout/main-layout.component';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'cattle',
        component: CattleListComponent
      },
      {
        path: 'cattle/:id',
        component: CattleDetailComponent
      },
      {
        path: 'protocols',
        component: ProtocolListComponent
      },
      {
        path: 'cycles',
        component: CycleListComponent
      },
      {
        path: 'health',
        loadChildren: () => import('./features/health/health.module').then(m => m.HealthModule)
      },
      {
        path: 'inseminations',
        component: InseminationListComponent
      },
      {
        path: 'reproduction',
        loadChildren: () => import('./features/reproduction/reproduction.module').then(m => m.ReproductionModule)
      },
      {
        path: 'users',
        loadChildren: () => import('./features/users/user-management.module').then(m => m.UserManagementModule)
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
