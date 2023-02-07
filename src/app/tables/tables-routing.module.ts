import { RouterModule, Routes } from '@angular/router';

import { AreasComponent } from './areas/areas.component';
import { AuthGuard } from '../guards/auth.guard';
import { CompaniesComponent } from './companies/companies.component';
import { EquipmentsComponent } from './equipments/equipments.component';
import { NgModule } from '@angular/core';
import { OncallsComponent } from './oncalls/oncalls.component';
import { OperatorsComponent } from './operators/operators.component';
import { PlantsComponent } from './plants/plants.component';
import { SystemsComponent } from './systems/systems.component';
import { UsersComponent } from './users/users.component';

const routes: Routes = [
  { path: '', redirectTo: 'areas', pathMatch: 'full' },
  { path: 'areas', component: AreasComponent, canActivate: [AuthGuard] },
  { path: 'plants', component: PlantsComponent, canActivate: [AuthGuard] },
  { path: 'equipments', component: EquipmentsComponent, canActivate: [AuthGuard] },
  { path: 'systems', component: SystemsComponent, canActivate: [AuthGuard] },
  { path: 'companies', component: CompaniesComponent, canActivate: [AuthGuard] },
  // { path: 'operators', component: OperatorsComponent, canActivate: [AuthGuard] },
  { path: 'users', component: UsersComponent, canActivate: [AuthGuard] },
  { path: 'oncalls', component: OncallsComponent, canActivate: [AuthGuard] },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TablesRoutingModule { }
