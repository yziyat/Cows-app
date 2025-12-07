import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

// Check if SharedModule exists or import Mat modules directly
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';

import { WorkListComponent } from './work-list/work-list.component';

const routes: Routes = [
    {
        path: '',
        component: WorkListComponent
    },
    {
        path: 'work-lists',
        component: WorkListComponent
    }
];

@NgModule({
    declarations: [
        WorkListComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        TranslateModule,
        MatTabsModule,
        MatIconModule,
        MatButtonModule,
        MatTableModule,
        MatChipsModule,
        MatCardModule
    ]
})
export class ReproductionModule { }
