import { Routes } from '@angular/router';
import { DashboardShellComponent } from './dashboard-shell.component';

export const routes: Routes = [
  { path: '', component: DashboardShellComponent },
  { path: 'tasks', component: DashboardShellComponent },
  { path: 'calendar', component: DashboardShellComponent },
  { path: 'analytics', component: DashboardShellComponent },
  { path: 'team', component: DashboardShellComponent },
  { path: 'settings', component: DashboardShellComponent },
  { path: 'help', component: DashboardShellComponent },
  { path: 'logout', component: DashboardShellComponent },
  { path: '**', redirectTo: '' }
];
