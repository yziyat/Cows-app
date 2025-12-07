import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HealthService } from '../../../core/services/health.service';
import { HealthRecord } from '../../../models/health.model';
import { HealthFormComponent } from '../health-form/health-form.component';

@Component({
    selector: 'app-health-list',
    templateUrl: './health-list.component.html',
    styleUrls: ['./health-list.component.scss']
})
export class HealthListComponent implements OnInit {
    records: HealthRecord[] = [];
    displayedColumns = ['date', 'ear_tag', 'diagnosis', 'status', 'actions'];
    loading = false;

    constructor(
        private healthService: HealthService,
        private dialog: MatDialog
    ) { }

    ngOnInit(): void {
        this.loadRecords();
    }

    loadRecords(): void {
        this.loading = true;
        this.healthService.getAllRecords().subscribe({
            next: (response: any) => {
                this.records = response.records;
                this.loading = false;
            },
            error: (err: any) => {
                console.error(err);
                this.loading = false;
            }
        });
    }

    openForm(record?: HealthRecord): void {
        const dialogRef = this.dialog.open(HealthFormComponent, {
            width: '500px',
            data: record
        });

        dialogRef.afterClosed().subscribe((result: any) => {
            if (result) {
                this.loadRecords();
            }
        });
    }
}
