import { AppRoutingModule } from '../app-routing.module';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../shared/material.module';
import { MenuListItemComponent } from './components/menu-list-item/menu-list-item.component';
import { NgModule } from '@angular/core';
import { SidemenuComponent } from './components/sidemenu/sidemenu.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    ToolbarComponent,
    SidemenuComponent,
    MenuListItemComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    AppRoutingModule,
    TranslateModule,
  ],
  exports: [
    ToolbarComponent,
    SidemenuComponent,
  ]
})
export class CoreModule { }
