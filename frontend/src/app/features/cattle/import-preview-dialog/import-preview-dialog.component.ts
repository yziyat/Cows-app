import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ImportResult, ImportRow } from '../../../models/import-result.model';
import { CattleService } from '../../../core/services/cattle.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin } from 'rxjs';

@Component({
    selector: 'app-import-preview-dialog',
    templateUrl: './import-preview-dialog.component.html',
    styleUrls: ['./import-preview-dialog.component.scss']
})
export class ImportPreviewDialogComponent {
    importResult: ImportResult;
    displayedColumns: string[] = ['rowNumber', 'earTag', 'breed', 'birthDate', 'status', 'issues'];
    importing = false;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: { importResult: ImportResult },
        private dialogRef: MatDialogRef<ImportPreviewDialogComponent>,
        private cattleService: CattleService,
        private snackBar: MatSnackBar
    ) {
        this.importResult = data.importResult;
    }

    getRowClass(row: ImportRow): string {
        if (!row.isValid) return 'error-row';
        if (row.warnings.length > 0) return 'warning-row';
        return '';
    }

    getIssuesText(row: ImportRow): string {
        const issues = [...row.errors, ...row.warnings];
        return issues.map(i => i.message).join(', ');
    }

    onCancel(): void {
        this.dialogRef.close();
    }

    onImport(): void {
        const validRows = this.importResult.rows.filter(r => r.isValid);

        if (validRows.length === 0) {
            this.snackBar.open('Aucune ligne valide à importer', 'OK', { duration: 3000 });
            return;
        }

        if (!confirm(`Importer ${validRows.length} animaux valides?`)) {
            return;
        }

        this.importing = true;

        // Create observables for all cattle
        const createObservables = validRows.map(row =>
            this.cattleService.createCattle(row.cleaned)
        );

        // Execute all creates
        forkJoin(createObservables).subscribe({
            next: (results) => {
                this.snackBar.open(
                    `${results.length} animaux importés avec succès!`,
                    'OK',
                    { duration: 5000 }
                );
                this.dialogRef.close({ imported: results.length });
            },
            error: (err) => {
                console.error('Import error:', err);
                this.snackBar.open(
                    'Erreur lors de l\'importation',
                    'OK',
                    { duration: 5000 }
                );
                this.importing = false;
            }
        });
    }
}
