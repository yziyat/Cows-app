import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../models/user.model';
import { MatSelectChange } from '@angular/material/select';

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
                <mat-select [value]="user.role" (selectionChange)="updateRole(user, $event)">
                  <mat-option value="admin">Admin</mat-option>
                  <mat-option value="editor">Éditeur</mat-option>
                  <mat-option value="viewer">Spectateur</mat-option>
                </mat-select>
              </mat-form-field>
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
  `]
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  displayedColumns: string[] = ['email', 'displayName', 'role'];
  loading = true;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
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
        this.loading = false;
      }
    });
  }

  updateRole(user: User, event: MatSelectChange): void {
    const newRole = event.value;
    if (confirm(`Changer le rôle de ${user.email} en ${newRole}?`)) {
      this.userService.updateUserRole(user.uid || user.id || '', newRole).subscribe({
        next: () => {
          // Success feedback?
        },
        error: (err) => {
          console.error(err);
          alert('Erreur lors de la mise à jour');
          // Revert? simpler to reload
          this.loadUsers();
        }
      });
    } else {
      // Revert selection visually if cancelled? 
      // Ideally we should reload or handle state, but this is a simple implementation.
      this.loadUsers();
    }
  }
}
