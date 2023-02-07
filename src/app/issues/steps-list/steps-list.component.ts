import { Component, Input, OnInit } from '@angular/core';

import { ArrayDataSource } from 'src/app/datasources/array.datasource';
import { AuthService } from './../../services/auth.service';
import { EditNoteDialogComponent } from './../edit-note-dialog/edit-note-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Step } from 'src/app/models/step';
import { StepService } from 'src/app/services/step.service';
import { first } from 'rxjs';

@Component({
  selector: 'app-steps-list',
  templateUrl: './steps-list.component.html',
  styleUrls: ['./steps-list.component.scss']
})
export class StepsListComponent implements OnInit {

  @Input() issueId!: number

  dataSource: ArrayDataSource<Step>

  displayedColumns = [
    "datetime",
    "state",
    "recipient",
    "notes",
    "user",
    "action"
  ]

  constructor(private stepService: StepService, public dialog: MatDialog, private authService: AuthService) {
    this.dataSource = new ArrayDataSource(stepService)
  }

  ngOnInit(): void {
    this.loadData()
  }

  loadData(): void {
    this.dataSource.load(this.issueId)
  }

  editStep(step: Step): void {

    const dialogRef = this.dialog.open(EditNoteDialogComponent, {
      disableClose: true,
      width: '500px',
      data: step,
      panelClass: 'custom-dialog-container',
    })

    dialogRef.afterClosed().pipe(first()).subscribe((result) => {
      console.dir(result)
      if (!!result) {
        this.loadData()
      }
    })
  }

  authorized(step: Step): boolean {

    if (!!this.authService.userValue) {
      const userName = this.authService.userValue?.name
      return (step.createdBy === userName) || (step.recipientUser === userName)
    }

    return false

  }

}
