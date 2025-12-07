import { Component, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ExcelService } from '../../../services/excel.service';
import { CycleService } from '../../../core/services/cycle.service';
import { SynchronizationProtocol } from '../../../models/protocol.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-bulk-protocol-assignment-dialog',
  templateUrl: './bulk-protocol-assignment-dialog.component.html',
  styleUrls: ['./bulk-protocol-assignment-dialog.component.scss']
})
export class BulkProtocolAssignmentDialogComponent {
  form: FormGroup;
  selectedFile: File | null = null;
  cattleList: any[] = [];
  previewCount: number | null = null;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private excelService: ExcelService,
    private cycleService: CycleService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<BulkProtocolAssignmentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { protocol: SynchronizationProtocol }
  ) {
    this.form = this.fb.group({
      start_date: [new Date(), Validators.required]
    });
  }

  async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.selectedFile = file;
      this.loading = true;
      try {
        const data = await this.excelService.readCattleFile(file);
        // We only care about IDs
        this.cattleList = data.filter(c => c.ear_tag).map(c => ({ ear_tag: c.ear_tag }));
        this.previewCount = this.cattleList.length;
        if (this.previewCount === 0) {
          this.snackBar.open('Aucun numéro d\'oreille (ID) trouvé dans le fichier.', 'Fermer', { panelClass: 'warn-snack' });
        }
      } catch (err) {
        console.error(err);
        this.snackBar.open('Erreur lors de la lecture du fichier.', 'Fermer', { panelClass: 'error-snack' });
        this.cattleList = [];
        this.previewCount = null;
      } finally {
        this.loading = false;
      }
    }
  }

  processAssignment(): void {
    if (this.loading) return;
    this.loading = true;

    const startDate = this.form.get('start_date')?.value;
    const protocol = this.data.protocol;

    this.cycleService.batchCreateCycles(protocol, startDate, this.cattleList).subscribe({
      next: (count: number) => {
        this.snackBar.open(`${count} cycles créés avec succès`, 'OK', { panelClass: 'success-snack' });
        this.dialogRef.close(true);
      },
      error: (err: any) => {
        console.error(err);
        this.snackBar.open('Erreur lors de la création des cycles', 'Fermer', { panelClass: 'error-snack' });
        this.loading = false;
      }
    });
  }
}
