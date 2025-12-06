import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { InseminationService } from '../../../core/services/insemination.service';
import { CattleService } from '../../../core/services/cattle.service';
import { Insemination } from '../../../models/insemination.model';
import { Cattle } from '../../../models/cattle.model';

@Component({
    selector: 'app-insemination-form-dialog',
    templateUrl: './insemination-form-dialog.component.html',
    styleUrls: ['./insemination-form-dialog.component.scss']
})
export class InseminationFormDialogComponent implements OnInit {
    form: FormGroup;
    isEditMode: boolean;
    loading = false;
    cattleList: Cattle[] = [];
    error = '';

    constructor(
        private fb: FormBuilder,
        private inseminationService: InseminationService,
        private cattleService: CattleService,
        private dialogRef: MatDialogRef<InseminationFormDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { insemination?: Insemination }
    ) {
        this.isEditMode = !!data.insemination;
        this.form = this.fb.group({
            cattle_id: [data.insemination?.cattle_id || '', Validators.required],
            date: [data.insemination?.date || new Date(), Validators.required],
            bull_id: [data.insemination?.bull_id || ''],
            technician_name: [data.insemination?.technician_name || ''],
            success: [data.insemination?.success]
        });
    }

    ngOnInit(): void {
        this.loadCattle();
    }

    loadCattle(): void {
        // Note: Ideally we should use a search/autocomplete here instead of loading all cattle
        this.cattleService.getCattle().subscribe({
            next: (response) => this.cattleList = response.cattle,
            error: (err) => console.error('Error loading cattle', err)
        });
    }

    onSubmit(): void {
        if (this.form.invalid) return;

        this.loading = true;
        const inseminationData = this.form.value;

        const request$ = this.isEditMode
            ? this.inseminationService.updateInsemination(this.data.insemination!.id, inseminationData)
            : this.inseminationService.createInsemination(inseminationData);

        request$.subscribe({
            next: () => this.dialogRef.close(true),
            error: (err) => {
                this.loading = false;
                this.error = 'Erreur lors de la sauvegarde';
            }
        });
    }

    onCancel(): void {
        this.dialogRef.close(false);
    }
}
