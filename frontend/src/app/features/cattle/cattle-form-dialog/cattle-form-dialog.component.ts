import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Cattle } from '../../../models/cattle.model';
import { CattleService } from '../../../core/services/cattle.service';

@Component({
    selector: 'app-cattle-form-dialog',
    templateUrl: './cattle-form-dialog.component.html',
    styleUrls: ['./cattle-form-dialog.component.scss']
})
export class CattleFormDialogComponent implements OnInit {
    form: FormGroup;
    isEditMode: boolean;
    loading = false;
    error = '';

    constructor(
        private fb: FormBuilder,
        private cattleService: CattleService,
        private dialogRef: MatDialogRef<CattleFormDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { cattle?: Cattle }
    ) {
        this.isEditMode = !!data.cattle;
        this.form = this.fb.group({
            ear_tag: [data.cattle?.ear_tag || '', Validators.required],
            name: [data.cattle?.name || ''],
            breed: [data.cattle?.breed || ''],
            sex: [data.cattle?.sex || 'female', Validators.required],
            birth_date: [data.cattle?.birth_date || null],
            weight: [data.cattle?.weight || null],
            mother_id: [data.cattle?.mother_id || null],
            father_id: [data.cattle?.father_id || null],
            status: [data.cattle?.status || 'active', Validators.required],
            notes: [data.cattle?.notes || '']
        });
    }

    ngOnInit(): void { }

    onSubmit(): void {
        if (this.form.invalid) return;

        this.loading = true;
        this.error = '';
        const cattleData = this.form.value;

        const request$ = this.isEditMode
            ? this.cattleService.updateCattle(this.data.cattle!.id, cattleData)
            : this.cattleService.createCattle(cattleData);

        request$.subscribe({
            next: (res) => {
                this.dialogRef.close(true);
            },
            error: (err) => {
                this.loading = false;
                this.error = err.error?.error || 'Une erreur est survenue';
            }
        });
    }

    onCancel(): void {
        this.dialogRef.close(false);
    }
}
