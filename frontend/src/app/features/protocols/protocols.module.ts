import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

// Material
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { ProtocolListComponent } from './protocol-list/protocol-list.component';
import { ProtocolFormDialogComponent } from './protocol-form-dialog/protocol-form-dialog.component';
import { BulkProtocolAssignmentDialogComponent } from './bulk-protocol-assignment-dialog/bulk-protocol-assignment-dialog.component';
import { AuthGuard } from '../../core/guards/auth.guard';

const routes: Routes = [
    { path: '', component: ProtocolListComponent, canActivate: [AuthGuard] }
];

@NgModule({
    declarations: [
        ProtocolListComponent,
        ProtocolFormDialogComponent,
        BulkProtocolAssignmentDialogComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterModule.forChild(routes),
        MatTableModule,
        MatButtonModule,
        MatIconModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatCardModule,
        MatPaginatorModule,
        MatSortModule,
        MatMenuModule,
        MatProgressSpinnerModule,
        MatTooltipModule,
        MatSnackBarModule
    ]
})
export class ProtocolsModule { }
