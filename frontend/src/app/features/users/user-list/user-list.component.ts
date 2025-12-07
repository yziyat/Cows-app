import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../core/services/user.service';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../models/user.model';
import { MatSelectChange } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-list',
  template: `
    <div class="user-list-container">
      <h1>Gestion des Utilisateurs</h1>

      <mat-card>
        <div class="loading-overlay" *ngIf="loading">
          <mat-spinner></mat-spinner>
        </div>

        <table mat-table [dataSource]="users" class="users-table">
          
          <ng-container matColumnDef="email">
            <th mat-header-cell *matHeaderCellDef> Email </th>
            <td mat-cell *matCellDef="let user"> {{user.email}} </td>
          </ng-container>

          <ng-container matColumnDef="displayName">
            <th mat-header-cell *matHeaderCellDef> Nom </th>
            <td mat-cell *matCellDef="let user"> {{user.displayName || '-'}} </td>
          </ng-container>

          <ng-container matColumnDef="role">
            <th mat-header-cell *matHeaderCellDef> Rôle </th>
            <td mat-cell *matCellDef="let user">
              <mat-form-field appearance="outline" subscriptSizing="dynamic">
                <mat-select [value]="user.role" (selectionChange)="updateRole(user, $event)" 
                            [disabled]="!isAdmin || user.uid === currentUser?.uid">
                  <mat-option value="admin">Admin</mat-option>
                  <mat-option value="editor">Éditeur</mat-option>
                  <mat-option value="viewer">Spectateur</mat-option>
                </mat-select>
              </mat-form-field>
            </td>
          </ng-container>

          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef> Statut </th>
            <td mat-cell *matCellDef="let user">
              <span class="status-badge" [class.active]="(user.status || 'active') === 'active'"
                                          [class.disabled]="user.status === 'disabled'">
                {{ (user.status || 'active') === 'active' ? 'Actif' : 'Désactivé' }}
              </span>
            </td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef> Actions </th>
            <td mat-cell *matCellDef="let user">
              <button mat-icon-button [matMenuTriggerFor]="menu" 
                      [disabled]="!isAdmin || user.uid === currentUser?.uid">
                <mat-icon>more_vert</mat-icon>
              </button>
              <mat-menu #menu="matMenu">
                <button mat-menu-item (click)="toggleUserStatus(user)" 
                        *ngIf="(user.status || 'active') === 'active'">
                  <mat-icon>block</mat-icon>
                  <span>Désactiver</span>
                </button>
                <button mat-menu-item (click)="toggleUserStatus(user)" 
                        *ngIf="user.status === 'disabled'">
                  <mat-icon>check_circle</mat-icon>
                  <span>Activer</span>
                </button>
                <button mat-menu-item (click)="deleteUser(user)" class="delete-action">
                  <mat-icon color="warn">delete</mat-icon>
                  <span>Supprimer</span>
                </button>
              </mat-menu>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
      </mat-card>
    </div>
  `,
  styles: [`
    .user-list-container {
      padding: 24px;
    }
    .users-table {
      width: 100%;
    }
    .loading-overlay {
      display: flex;
      justify-content: center;
      padding: 20px;
    }
    mat-form-field {
      width: 150px;
    }
    .status-badge {
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
    }
    .status-badge.active {
      background-color: #4caf50;
      color: white;
    }
    .status-badge.disabled {
      background-color: #f44336;
      color: white;
    }
    .delete-action {
      color: #f44336;
    }
  `]
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  displayedColumns: string[] = ['email', 'displayName', 'role', 'status', 'actions'];
  loading = true;
  isAdmin = false;
  currentUser: User | null = null;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    // Check if current user is admin
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
      this.isAdmin = user?.role === 'admin';
    });
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading users', err);
        this.snackBar.open('Erreur lors du chargement des utilisateurs', 'OK', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  updateRole(user: User, event: MatSelectChange): void {
    const newRole = event.value;
    if (confirm(`Changer le rôle de ${user.email} en ${newRole}?`)) {
      this.userService.updateUserRole(user.uid || user.id || '', newRole).subscribe({
        next: () => {
          this.snackBar.open('Rôle mis à jour avec succès', 'OK', { duration: 3000 });
          this.loadUsers();
        },
        error: (err) => {
          console.error(err);
          this.snackBar.open('Erreur lors de la mise à jour du rôle', 'OK', { duration: 3000 });
          this.loadUsers();
        }
      });
    } else {
      this.loadUsers();
    }
  }

  toggleUserStatus(user: User): void {
    const isActive = (user.status || 'active') === 'active';
    const action = isActive ? 'désactiver' : 'activer';
    const uid = user.uid || user.id || '';

    if (confirm(`Voulez-vous vraiment ${action} l'utilisateur ${user.email}?`)) {
      const operation = isActive
        ? this.userService.disableUser(uid)
        : this.userService.enableUser(uid);

      operation.subscribe({
        next: () => {
          this.snackBar.open(`Utilisateur ${isActive ? 'désactivé' : 'activé'} avec succès`, 'OK', { duration: 3000 });
          this.loadUsers();
        },
        error: (err) => {
          console.error(err);
          this.snackBar.open('Erreur lors de la modification du statut', 'OK', { duration: 3000 });
        }
      });
    }
  }

  deleteUser(user: User): void {
    const uid = user.uid || user.id || '';
    if (confirm(`⚠️ ATTENTION: Voulez-vous vraiment supprimer définitivement l'utilisateur ${user.email}? Cette action est irréversible!`)) {
      this.userService.deleteUser(uid).subscribe({
        next: () => {
          this.snackBar.open('Utilisateur supprimé avec succès', 'OK', { duration: 3000 });
          this.loadUsers();
        },
        error: (err) => {
          console.error(err);
          this.snackBar.open('Erreur lors de la suppression', 'OK', { duration: 3000 });
        }
      });
    }
  }
}
