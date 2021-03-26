import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  { path: '', loadChildren: () => import('./Views/session/session.module').then(m=>m.SessionModule)},
  { path: 'admin', loadChildren: () => import('./Views/admin/admin.module').then(m => m.AdminModule) }, 
  { path: 'session', loadChildren: () => import('./Views/session/session.module').then(m => m.SessionModule) }, 
  { path: 'reports', loadChildren: () => import('./Views/reports/reports.module').then(m => m.ReportsModule) },
  { path: 'quiz', loadChildren: () => import('./Views/quiz/quiz.module').then(m => m.QuizModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
