// src/app/app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

// Factory for TranslateHttpLoader
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
import { environment } from '../environments/environment';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getAuth, provideAuth } from '@angular/fire/auth';

// Angular Material
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule, MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Interceptors
import { AuthInterceptor } from './core/interceptors/auth.interceptor';

// Components
import { LoginComponent } from './features/auth/login/login.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { CattleListComponent } from './features/cattle/cattle-list/cattle-list.component';
import { MainLayoutComponent } from './shared/components/main-layout/main-layout.component';
import { CattleFormDialogComponent } from './features/cattle/cattle-form-dialog/cattle-form-dialog.component';
import { CattleDetailComponent } from './features/cattle/cattle-detail/cattle-detail.component';
import { ProtocolListComponent } from './features/protocols/protocol-list/protocol-list.component';
import { ProtocolFormDialogComponent } from './features/protocols/protocol-form-dialog/protocol-form-dialog.component';
import { CycleListComponent } from './features/cycles/cycle-list/cycle-list.component';
import { CycleFormDialogComponent } from './features/cycles/cycle-form-dialog/cycle-form-dialog.component';
import { InseminationListComponent } from './features/inseminations/insemination-list/insemination-list.component';
import { InseminationFormDialogComponent } from './features/inseminations/insemination-form-dialog/insemination-form-dialog.component';
import { ImportPreviewDialogComponent } from './features/cattle/import-preview-dialog/import-preview-dialog.component';
import { PenListComponent } from './features/pens/pen-list/pen-list.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    CattleListComponent,
    MainLayoutComponent,
    CattleFormDialogComponent,
    CattleDetailComponent,
    ProtocolListComponent,
    ProtocolFormDialogComponent,
    CycleListComponent,
    CycleFormDialogComponent,
    InseminationListComponent,
    InseminationFormDialogComponent,
    ImportPreviewDialogComponent,
    PenListComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    AppRoutingModule,
    // Translate Module
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    // Firebase Modules
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    // Material Modules
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSelectModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatChipsModule,
    MatTooltipModule,
    MatTooltipModule,
    MatSnackBarModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'center'
      }
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
