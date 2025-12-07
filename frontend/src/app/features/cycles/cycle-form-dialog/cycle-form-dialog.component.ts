import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SynchronizationCycle } from '../../../models/cycle.model';
import { CycleService } from '../../../core/services/cycle.service';
import { ProtocolService } from '../../../core/services/protocol.service';
import { SynchronizationProtocol } from '../../../models/protocol.model';

@Component({
    selector: 'app-cycle-form-dialog',
    templateUrl: './cycle-form-dialog.component.html',
    styleUrls: ['./cycle-form-dialog.component.scss']
})
export class CycleFormDialogComponent implements OnInit {
    form: FormGroup;
    isEditMode: boolean;
    loading = false;
    protocols: SynchronizationProtocol[] = [];
    error = '';

    constructor(
        private fb: FormBuilder,
        private cycleService: CycleService,
        private protocolService: ProtocolService,
        private dialogRef: MatDialogRef<CycleFormDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { cycle?: SynchronizationCycle }
    ) {
        this.isEditMode = !!data.cycle;
        this.form = this.fb.group({
            protocol_id: [data.cycle?.protocol_id || '', Validators.required],
            start_date: [data.cycle?.start_date || new Date(), Validators.required],
            status: [data.cycle?.status || 'active', Validators.required]
        });
    }

    ngOnInit(): void {
        this.loadProtocols();
    }

    loadProtocols(): void {
        this.protocolService.getAllProtocols().subscribe({
            next: (response) => this.protocols = response.protocols,
            error: (err) => console.error('Error loading protocols', err)
        });
    }

    onSubmit(): void {
        if (this.form.invalid) return;

        this.loading = true;
        const cycleData = this.form.value;

        const request$ = this.isEditMode
            ? this.cycleService.updateCycle(this.data.cycle!.id, cycleData)
            : this.cycleService.createCycle(cycleData);

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
