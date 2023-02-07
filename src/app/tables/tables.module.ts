import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AreaDeleteDialogComponent } from './areas/area-delete-dialog/area-delete-dialog.component';
import { AreaDialogComponent } from './areas/area-dialog/area-dialog.component';
import { AreasComponent } from './areas/areas.component';
import { AttributesDialogComponent } from './areas/attributes-dialog/attributes-dialog.component';
import { CommonModule } from '@angular/common';
import { CompaniesComponent } from './companies/companies.component';
import { CompanyDeleteDialogComponent } from './companies/company-delete-dialog/company-delete-dialog.component';
import { CompanyDialogComponent } from './companies/company-dialog/company-dialog.component';
import { DirectivesModule } from './../directives/directives.module';
import { EquipmentDeleteDialogComponent } from './equipments/equipment-delete-dialog/equipment-delete-dialog.component';
import { EquipmentDialogComponent } from './equipments/equipment-dialog/equipment-dialog.component';
import { EquipmentsComponent } from './equipments/equipments.component';
import { MaterialModule } from '../shared/material.module';
import { NgModule } from '@angular/core';
import { OncallsComponent } from './oncalls/oncalls.component';
import { OncallsDeleteDialogComponent } from './oncalls/oncalls-delete-dialog/oncalls-delete-dialog.component';
import { OncallsDialogComponent } from './oncalls/oncalls-dialog/oncalls-dialog.component';
import { OperatorsComponent } from './operators/operators.component';
import { PipesModule } from '../pipes/pipes.module';
import { PlantDeleteDialogComponent } from './plants/plant-delete-dialog/plant-delete-dialog.component';
import { PlantDialogComponent } from './plants/plant-dialog/plant-dialog.component';
import { PlantsComponent } from './plants/plants.component';
import { SystemDeleteDialogComponent } from './systems/system-delete-dialog/system-delete-dialog.component';
import { SystemDialogComponent } from './systems/system-dialog/system-dialog.component';
import { SystemsComponent } from './systems/systems.component';
import { TablesRoutingModule } from './tables-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { UserDialogComponent } from './users/user-dialog/user-dialog.component';
import { UsersComponent } from './users/users.component';

@NgModule({
  declarations: [
    PlantsComponent,
    EquipmentsComponent,
    AreasComponent,
    AreaDialogComponent,
    AreaDeleteDialogComponent,
    PlantDialogComponent,
    PlantDeleteDialogComponent,
    EquipmentDeleteDialogComponent,
    EquipmentDialogComponent,
    SystemsComponent,
    SystemDialogComponent,
    SystemDeleteDialogComponent,
    CompaniesComponent,
    CompanyDeleteDialogComponent,
    CompanyDialogComponent,
    OperatorsComponent,
    UsersComponent,
    UserDialogComponent,
    AttributesDialogComponent,
    OncallsComponent,
    OncallsDialogComponent,
    OncallsDeleteDialogComponent,
  ],
  imports: [
    TablesRoutingModule,
    CommonModule,
    MaterialModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    DirectivesModule,
    PipesModule,
  ],
  exports: [
    PlantsComponent,
  ]
})
export class TablesModule { }
