import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SynchronizationProtocol } from '../../../models/protocol.model';
import { ProtocolService } from '../../../core/services/protocol.service';

@Component({
    selector: 'app-protocol-form-dialog',
    templateUrl: './protocol-form-dialog.component.html',
    styleUrls: ['./protocol-form-dialog.component.scss']
})
export class ProtocolFormDialogComponent {
    form: FormGroup;
    isEditMode: boolean;
    loading = false;
    error = '';

    constructor(
        private fb: FormBuilder,
        private protocolService: ProtocolService,
        private dialogRef: MatDialogRef<ProtocolFormDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { protocol?: SynchronizationProtocol }
    ) {
        this.isEditMode = !!data.protocol;
        this.form = this.fb.group({
            name: [data.protocol?.name || '', Validators.required],
            description: [data.protocol?.description || ''],
            duration_days: [data.protocol?.duration_days || 0, [Validators.required, Validators.min(0)]],
            steps: this.fb.array(data.protocol?.steps?.map(step => this.createStepGroup(step)) || [])
        });
    }

    get steps(): FormArray {
        return this.form.get('steps') as FormArray;
    }

    createStepGroup(step: any = {}): FormGroup {
        return this.fb.group({
            day_number: [step.day_number || 0, [Validators.required, Validators.min(0)]],
            action: [step.action || '', Validators.required],
            product: [step.product || ''],
            dosage: [step.dosage || ''],
            notes: [step.notes || '']
        });
    }

    addStep(): void {
        this.steps.push(this.createStepGroup());
    }

    removeStep(index: number): void {
        this.steps.removeAt(index);
    }

    onSubmit(): void {
        if (this.form.invalid) return;

        this.loading = true;
        const protocolData = this.form.value;

        const request$ = this.isEditMode
            ? this.protocolService.updateProtocol(this.data.protocol!.id, protocolData)
            : this.protocolService.createProtocol(protocolData);

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
