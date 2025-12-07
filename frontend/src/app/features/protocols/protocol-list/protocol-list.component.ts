import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { ProtocolService } from '../../../core/services/protocol.service';
import { AuthService } from '../../../core/services/auth.service';
import { SynchronizationProtocol } from '../../../models/protocol.model';
import { ProtocolFormDialogComponent } from '../protocol-form-dialog/protocol-form-dialog.component';
import { BulkProtocolAssignmentDialogComponent } from '../bulk-protocol-assignment-dialog/bulk-protocol-assignment-dialog.component';

@Component({
    selector: 'app-protocol-list',
    templateUrl: './protocol-list.component.html',
    styleUrls: ['./protocol-list.component.scss']
})
export class ProtocolListComponent implements OnInit {
    displayedColumns: string[] = ['name', 'duration', 'steps', 'status', 'actions'];
    dataSource: MatTableDataSource<SynchronizationProtocol>;
    loading = true;

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    constructor(
        private protocolService: ProtocolService,
        public authService: AuthService,
        private dialog: MatDialog
    ) {
        this.dataSource = new MatTableDataSource<SynchronizationProtocol>();
    }

    ngOnInit(): void {
        this.loadProtocols();
    }

    loadProtocols(): void {
        this.loading = true;
        this.protocolService.getAllProtocols().subscribe({
            next: (response) => {
                this.dataSource.data = response.protocols;
                this.loading = false;
                setTimeout(() => {
                    this.dataSource.paginator = this.paginator;
                    this.dataSource.sort = this.sort;
                });
            },
            error: (err) => {
                console.error('Error loading protocols:', err);
                this.loading = false;
            }
        });
    }

    openCreateDialog(): void {
        const dialogRef = this.dialog.open(ProtocolFormDialogComponent, {
            width: '600px',
            data: { protocol: null }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) this.loadProtocols();
        });
    }

    editProtocol(protocol: SynchronizationProtocol): void {
        const dialogRef = this.dialog.open(ProtocolFormDialogComponent, {
            width: '600px',
            data: { protocol }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) this.loadProtocols();
        });
    }

    deleteProtocol(protocol: SynchronizationProtocol): void {
        if (confirm(`Supprimer le protocole ${protocol.name} ?`)) {
            this.protocolService.deleteProtocol(protocol.id).subscribe({
                next: () => this.loadProtocols(),
                error: (err) => console.error(err)
            });
        }
    }

    openBulkAssignDialog(protocol: SynchronizationProtocol): void {
        this.dialog.open(BulkProtocolAssignmentDialogComponent, {
            width: '600px',
            data: { protocol }
        });
    }
}
