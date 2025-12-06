import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { CycleService } from '../../../core/services/cycle.service';
import { SynchronizationCycle } from '../../../models/cycle.model';
import { CycleFormDialogComponent } from '../cycle-form-dialog/cycle-form-dialog.component';

@Component({
    selector: 'app-cycle-list',
    templateUrl: './cycle-list.component.html',
    styleUrls: ['./cycle-list.component.scss']
})
export class CycleListComponent implements OnInit {
    displayedColumns: string[] = ['startDate', 'protocol', 'cattleCount', 'status', 'actions'];
    dataSource: MatTableDataSource<SynchronizationCycle>;
    loading = true;

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    constructor(
        private cycleService: CycleService,
        private dialog: MatDialog
    ) {
        this.dataSource = new MatTableDataSource<SynchronizationCycle>();
    }

    ngOnInit(): void {
        this.loadCycles();
    }

    loadCycles(): void {
        this.loading = true;
        this.cycleService.getCycles().subscribe({
            next: (cycles) => {
                this.dataSource.data = cycles;
                this.loading = false;
                setTimeout(() => {
                    this.dataSource.paginator = this.paginator;
                    this.dataSource.sort = this.sort;
                });
            },
            error: (err) => {
                console.error('Error loading cycles:', err);
                this.loading = false;
            }
        });
    }

    openCreateDialog(): void {
        const dialogRef = this.dialog.open(CycleFormDialogComponent, {
            width: '600px',
            data: { cycle: null }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) this.loadCycles();
        });
    }

    editCycle(cycle: SynchronizationCycle): void {
        const dialogRef = this.dialog.open(CycleFormDialogComponent, {
            width: '600px',
            data: { cycle }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) this.loadCycles();
        });
    }
}
