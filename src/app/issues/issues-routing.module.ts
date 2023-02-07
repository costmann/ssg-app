import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '../guards/auth.guard';
import { IssuesComponent } from './issues.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
  { path: '', component: IssuesComponent, canActivate: [AuthGuard]}
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IssuesRoutingModule { }
