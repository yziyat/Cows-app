import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { InseminationService } from '../../../core/services/insemination.service';
import { Insemination } from '../../../models/insemination.model';
import { InseminationFormDialogComponent } from '../insemination-form-dialog/insemination-form-dialog.component';

@Component({
    selector: 'app-insemination-list',
    templateUrl: './insemination-list.component.html',
    styleUrls: ['./insemination-list.component.scss']
})
export class InseminationListComponent implements OnInit {
    displayedColumns: string[] = ['date', 'cattle', 'bull', 'technician', 'success', 'actions'];
    dataSource: MatTableDataSource<Insemination>;
    loading = true;

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    constructor(
        private inseminationService: InseminationService,
        private dialog: MatDialog
    ) {
        this.dataSource = new MatTableDataSource<Insemination>();
    }

    ngOnInit(): void {
        this.loadInseminations();
    }

    loadInseminations(): void {
        this.loading = true;
        this.inseminationService.getInseminations().subscribe({
            next: (data) => {
                this.dataSource.data = data;
                this.loading = false;
                setTimeout(() => {
                    this.dataSource.paginator = this.paginator;
                    this.dataSource.sort = this.sort;
                });
            },
            error: (err) => {
                console.error('Error loading inseminations:', err);
                this.loading = false;
            }
        });
    }

    openCreateDialog(): void {
        const dialogRef = this.dialog.open(InseminationFormDialogComponent, {
            width: '600px',
            data: { insemination: null }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) this.loadInseminations();
        });
    }

    editInsemination(insemination: Insemination): void {
        const dialogRef = this.dialog.open(InseminationFormDialogComponent, {
            width: '600px',
            data: { insemination }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) this.loadInseminations();
        });
    }
}
