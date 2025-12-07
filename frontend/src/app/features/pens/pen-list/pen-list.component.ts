import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PenService } from '../../../core/services/pen.service';
import { AuthService } from '../../../core/services/auth.service';
import { Pen } from '../../../models/pen.model';

@Component({
    selector: 'app-pen-list',
    template: `
    <div class="pen-list-container">
      <div class="header">
        <h1>Gestion des Enclos</h1>
        <button mat-raised-button color="primary" (click)="openPenDialog()" 
                *ngIf="canEdit">
          <mat-icon>add</mat-icon>
          Ajouter un Enclos
        </button>
      </div>

      <mat-card>
        <div class="loading-overlay" *ngIf="loading">
          <mat-spinner></mat-spinner>
        </div>

        <table mat-table [dataSource]="pens" class="pens-table">
          
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>Nom</th>
            <td mat-cell *matCellDef="let pen">{{pen.name}}</td>
          </ng-container>

          <ng-container matColumnDef="location">
            <th mat-header-cell *matHeaderCellDef>Emplacement</th>
            <td mat-cell *matCellDef="let pen">{{pen.location}}</td>
          </ng-container>

          <ng-container matColumnDef="type">
            <th mat-header-cell *matHeaderCellDef>Type</th>
            <td mat-cell *matCellDef="let pen">
              <span class="pen-type-badge" [attr.data-type]="pen.type">
                {{getPenTypeLabel(pen.type)}}
              </span>
            </td>
          </ng-container>

          <ng-container matColumnDef="capacity">
            <th mat-header-cell *matHeaderCellDef>Capacité</th>
            <td mat-cell *matCellDef="let pen">{{pen.capacity}}</td>
          </ng-container>

          <ng-container matColumnDef="occupancy">
            <th mat-header-cell *matHeaderCellDef>Occupation</th>
            <td mat-cell *matCellDef="let pen">
              <div class="occupancy-container">
                <span class="occupancy-text">
                  {{pen.current_occupancy || 0}} / {{pen.capacity}}
                </span>
                <div class="occupancy-bar">
                  <div class="occupancy-fill" 
                       [style.width.%]="getOccupancyPercent(pen)"
                       [class.high]="getOccupancyPercent(pen) > 80"
                       [class.medium]="getOccupancyPercent(pen) > 50 && getOccupancyPercent(pen) <= 80">
                  </div>
                </div>
              </div>
            </td>
          </ng-container>

          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Statut</th>
            <td mat-cell *matCellDef="let pen">
              <span class="status-badge" [attr.data-status]="pen.status">
                {{getStatusLabel(pen.status)}}
              </span>
            </td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let pen">
              <button mat-icon-button [matMenuTriggerFor]="menu" *ngIf="canEdit">
                <mat-icon>more_vert</mat-icon>
              </button>
              <mat-menu #menu="matMenu">
                <button mat-menu-item (click)="editPen(pen)">
                  <mat-icon>edit</mat-icon>
                  <span>Modifier</span>
                </button>
                <button mat-menu-item (click)="deletePen(pen)" 
                        [disabled]="(pen.current_occupancy || 0) > 0">
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
    .pen-list-container {
      padding: 24px;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }
    .pens-table {
      width: 100%;
    }
    .loading-overlay {
      display: flex;
      justify-content: center;
      padding: 20px;
    }
    .pen-type-badge {
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
      background-color: #e0e0e0;
    }
    .pen-type-badge[data-type="maternity"] { background-color: #ffcdd2; color: #c62828; }
    .pen-type-badge[data-type="milking"] { background-color: #c5e1a5; color: #558b2f; }
    .pen-type-badge[data-type="dry"] { background-color: #fff9c4; color: #f57f17; }
    .pen-type-badge[data-type="heifer"] { background-color: #b3e5fc; color: #01579b; }
    .pen-type-badge[data-type="isolation"] { background-color: #f8bbd0; color: #880e4f; }
    
    .occupancy-container {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .occupancy-text {
      font-size: 12px;
      color: #666;
    }
    .occupancy-bar {
      width: 100px;
      height: 8px;
      background-color: #e0e0e0;
      border-radius: 4px;
      overflow: hidden;
    }
    .occupancy-fill {
      height: 100%;
      background-color: #4caf50;
      transition: width 0.3s ease;
    }
    .occupancy-fill.medium {
      background-color: #ff9800;
    }
    .occupancy-fill.high {
      background-color: #f44336;
    }
    .status-badge {
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
    }
    .status-badge[data-status="active"] { background-color: #4caf50; color: white; }
    .status-badge[data-status="maintenance"] { background-color: #ff9800; color: white; }
    .status-badge[data-status="inactive"] { background-color: #9e9e9e; color: white; }
  `]
})
export class PenListComponent implements OnInit {
    pens: Pen[] = [];
    displayedColumns: string[] = ['name', 'location', 'type', 'capacity', 'occupancy', 'status', 'actions'];
    loading = true;
    canEdit = false;

    constructor(
        private penService: PenService,
        private authService: AuthService,
        private dialog: MatDialog,
        private snackBar: MatSnackBar
    ) { }

    ngOnInit(): void {
        this.authService.currentUser.subscribe(user => {
            this.canEdit = user?.role === 'admin' || user?.role === 'editor';
        });
        this.loadPens();
    }

    loadPens(): void {
        this.loading = true;
        this.penService.getAllPens().subscribe({
            next: (pens) => {
                this.pens = pens;
                this.loading = false;
            },
            error: (err) => {
                console.error('Error loading pens:', err);
                this.snackBar.open('Erreur lors du chargement des enclos', 'OK', { duration: 3000 });
                this.loading = false;
            }
        });
    }

    openPenDialog(pen?: Pen): void {
        // TODO: Implement pen form dialog
        this.snackBar.open('Formulaire d\'enclos à implémenter', 'OK', { duration: 2000 });
    }

    editPen(pen: Pen): void {
        this.openPenDialog(pen);
    }

    deletePen(pen: Pen): void {
        if ((pen.current_occupancy || 0) > 0) {
            this.snackBar.open('Impossible de supprimer un enclos occupé', 'OK', { duration: 3000 });
            return;
        }

        if (confirm(`Supprimer l'enclos "${pen.name}"?`)) {
            this.penService.deletePen(pen.id!).subscribe({
                next: () => {
                    this.snackBar.open('Enclos supprimé', 'OK', { duration: 3000 });
                    this.loadPens();
                },
                error: (err) => {
                    console.error('Error deleting pen:', err);
                    this.snackBar.open('Erreur lors de la suppression', 'OK', { duration: 3000 });
                }
            });
        }
    }

    getOccupancyPercent(pen: Pen): number {
        if (!pen.capacity) return 0;
        return ((pen.current_occupancy || 0) / pen.capacity) * 100;
    }

    getPenTypeLabel(type: string): string {
        const labels: any = {
            'maternity': 'Maternité',
            'milking': 'Traite',
            'dry': 'Taries',
            'heifer': 'Génisses',
            'isolation': 'Isolement',
            'general': 'Général'
        };
        return labels[type] || type;
    }

    getStatusLabel(status: string): string {
        const labels: any = {
            'active': 'Actif',
            'maintenance': 'Maintenance',
            'inactive': 'Inactif'
        };
        return labels[status] || status;
    }
}
