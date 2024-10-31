import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter, Routes } from '@angular/router';
import { AppComponent } from './app/app.component';
import { SyncComponent } from './app/sync/sync.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { importProvidersFrom } from '@angular/core';

const routes: Routes = [
  { path: '', redirectTo: 'sync', pathMatch: 'full' },
  { path: 'sync', component: SyncComponent },
];

bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes), provideHttpClient(),importProvidersFrom(BrowserAnimationsModule)],  // Use provideHttpClient here
}).catch((err) => console.error(err));
