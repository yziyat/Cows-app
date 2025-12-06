// src/app/features/cattle/cattle-list/cattle-list.component.ts
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { CattleService } from '../../../core/services/cattle.service';
import { AuthService } from '../../../core/services/auth.service';
import { Cattle } from '../../../models/cattle.model';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-cattle-list',
  templateUrl: './cattle-list.component.html',
  styleUrls: ['./cattle-list.component.scss']
})
export class CattleListComponent implements OnInit {
  displayedColumns: string[] = ['ear_tag', 'name', 'breed', 'sex', 'birth_date', 'status', 'actions'];
  dataSource: MatTableDataSource<Cattle>;
  loading = true;
  searchControl = new FormControl('');
  statusFilter = new FormControl('active');
  sexFilter = new FormControl('');

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private cattleService: CattleService,
    public authService: AuthService,
    private dialog: MatDialog
  ) {
    this.dataSource = new MatTableDataSource<Cattle>();
  }

  ngOnInit(): void {
    this.loadCattle();
    this.setupFilters();
  }

  setupFilters(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(() => this.loadCattle());

    this.statusFilter.valueChanges.subscribe(() => this.loadCattle());
    this.sexFilter.valueChanges.subscribe(() => this.loadCattle());
  }

  loadCattle(): void {
    this.loading = true;
    
    const params: any = {};
    if (this.statusFilter.value) params.status = this.statusFilter.value;
    if (this.sexFilter.value) params.sex = this.sexFilter.value;
    if (this.searchControl.value) params.search = this.searchControl.value;
    params.limit = 100;

    this.cattleService.getAllCattle(params).subscribe({
      next: (response) => {
        this.dataSource.data = response.cattle;
        this.loading = false;
        
        setTimeout(() => {
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        });
      },
      error: (err) => {
        console.error('Error loading cattle:', err);
        this.loading = false;
      }
    });
  }

  canEdit(): boolean {
    return this.authService.hasRole(['admin', 'editor']);
  }

  canDelete(): boolean {
    return this.authService.hasRole(['admin']);
  }

  openCreateDialog(): void {
    // TODO: Ouvrir dialogue de création
    console.log('Open create dialog');
  }

  editCattle(cattle: Cattle): void {
    // TODO: Ouvrir dialogue d'édition
    console.log('Edit cattle:', cattle);
  }

  deleteCattle(cattle: Cattle): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer ${cattle.ear_tag}?`)) {
      this.cattleService.deleteCattle(cattle.id).subscribe({
        next: () => {
          this.loadCattle();
        },
        error: (err) => {
          console.error('Error deleting cattle:', err);
          alert('Erreur lors de la suppression');
        }
      });
    }
  }

  viewDetails(cattle: Cattle): void {
    // TODO: Navigation vers détails
    console.log('View details:', cattle);
  }
}
