import { Routes } from '@angular/router';
import { DashboardShellComponent } from './dashboard-shell.component';

export const routes: Routes = [
  { path: '', component: DashboardShellComponent },
  { path: 'profesores', component: DashboardShellComponent },
  { path: 'profesores/nuevo', component: DashboardShellComponent },
  { path: 'profesor/:id', component: DashboardShellComponent },
  { path: 'profesor/:id/editar', component: DashboardShellComponent },
  { path: 'asignacion-academica', component: DashboardShellComponent },
  { path: 'calculo-pagos', component: DashboardShellComponent },
  { path: 'cumplimiento-fiscal', component: DashboardShellComponent },
  { path: 'operacion-bancaria', component: DashboardShellComponent },
  { path: 'contabilidad-reportes', component: DashboardShellComponent },
  { path: 'administracion', component: DashboardShellComponent },
  { path: 'settings', component: DashboardShellComponent },
  { path: 'help', component: DashboardShellComponent },
  { path: 'logout', component: DashboardShellComponent },
  { path: '**', redirectTo: '' }
];
