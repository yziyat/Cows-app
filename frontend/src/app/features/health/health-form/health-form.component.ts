import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HealthService } from '../../../core/services/health.service';
import { HealthRecord } from '../../../models/health.model';
// import { CattleService } from '../../../core/services/cattle.service'; // Need to select cattle

@Component({
    selector: 'app-health-form',
    templateUrl: './health-form.component.html',
    styleUrls: ['./health-form.component.scss']
})
export class HealthFormComponent implements OnInit {
    form: FormGroup;
    isEdit = false;
    loading = false;
    // cattleList: any[] = []; 

    constructor(
        private fb: FormBuilder,
        private healthService: HealthService,
        private dialogRef: MatDialogRef<HealthFormComponent>,
        @Inject(MAT_DIALOG_DATA) public data: HealthRecord
    ) {
        this.form = this.fb.group({
            ear_tag: ['', Validators.required], // Should be select in real app
            diagnosis: ['', Validators.required],
            diagnosis_date: [new Date(), Validators.required],
            severity: ['MILD', Validators.required],
            status: ['ACTIVE', Validators.required],
            notes: ['']
        });

        if (data) {
            this.isEdit = true;
            this.form.patchValue(data);
        }
    }

    ngOnInit(): void {
        // Load cattle list
    }

    onSubmit(): void {
        if (this.form.valid) {
            this.loading = true;
            const record = this.form.value;

            let request$;
            if (this.isEdit) {
                request$ = this.healthService.updateRecord(this.data.id, record);
            } else {
                request$ = this.healthService.createRecord(record);
            }

            request$.subscribe({
                next: () => {
                    this.loading = false;
                    this.dialogRef.close(true);
                },
                error: (err: any) => {
                    console.error(err);
                    this.loading = false;
                }
            });
        }
    }
}

