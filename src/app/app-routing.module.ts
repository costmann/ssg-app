import { RouterModule, Routes } from '@angular/router';

import { IsLoggedInGuard } from './guards/is-logged-in.guard';
import { LoginComponent } from './login/login.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [IsLoggedInGuard] },
  { path: 'issues', loadChildren: () => import('./issues/issues.module').then(m => m.IssuesModule) },
  { path: 'tables', loadChildren: () => import('./tables/tables.module').then(m => m.TablesModule) },
  { path: '', redirectTo: 'issues', pathMatch: 'full' },
  { path: '**', redirectTo: '/', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
