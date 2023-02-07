import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AssignDialogComponent } from './commands/assign-dialog/assign-dialog.component';
import { CommonModule } from '@angular/common';
import { CreateIssueDialogComponent } from './create-issue-dialog/create-issue-dialog.component';
import { DefaultDialogComponent } from './commands/default-dialog/default-dialog.component';
import { DirectivesModule } from './../directives/directives.module';
import { EditNoteDialogComponent } from './edit-note-dialog/edit-note-dialog.component';
import { IssueComponent } from './issue/issue.component';
import { IssuesComponent } from './issues.component';
import { IssuesListComponent } from './issues-list/issues-list.component';
import { IssuesRoutingModule } from './issues-routing.module';
import { MaterialModule } from '../shared/material.module';
import { NgModule } from '@angular/core';
import { OpenDialogComponent } from './commands/open-dialog/open-dialog.component';
import { PipesModule } from './../pipes/pipes.module';
import { StepsListComponent } from './steps-list/steps-list.component';
import { TranslateModule } from '@ngx-translate/core';
import { AttributesListComponent } from './attributes-list/attributes-list.component';

@NgModule({
  declarations: [
    IssuesListComponent,
    CreateIssueDialogComponent,
    IssuesComponent,
    IssueComponent,
    StepsListComponent,
    EditNoteDialogComponent,
    AssignDialogComponent,
    DefaultDialogComponent,
    OpenDialogComponent,
    AttributesListComponent,
  ],
  imports: [
    CommonModule,
    IssuesRoutingModule,
    MaterialModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    DirectivesModule,
    PipesModule
  ]
})
export class IssuesModule { }
