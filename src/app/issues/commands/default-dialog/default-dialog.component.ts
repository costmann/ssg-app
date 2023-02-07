import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { first } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { Command } from 'src/app/models/command';
import { IssueService } from 'src/app/services/issue.service';
import { Issue } from 'src/app/models/issue';

@Component({
  selector: 'app-default-dialog',
  templateUrl: './default-dialog.component.html',
  styleUrls: ['./default-dialog.component.scss']
})
export class DefaultDialogComponent implements OnInit {

  form: FormGroup

  idControl: FormControl
  notesControl: FormControl
  commandControl: FormControl

  plantRequired = false
  plantDisabled = true

  saving = false
  errorMessage = ''


  constructor(
    public dialogRef: MatDialogRef<DefaultDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {issue: Issue, command: Command},
    private issueService: IssueService,
  ) {
    this.idControl = new FormControl(data.issue.id, [Validators.required])
    this.notesControl = new FormControl(null)
    this.commandControl = new FormControl(data.command.commandName)

    this.form = new FormGroup({
      id: this.idControl,
      notes: this.notesControl,
      commandName: this.commandControl,
    })

  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    this.saving = true
    this.errorMessage = ''
    this.issueService.exec(this.form.value).pipe(first()).subscribe({
      next: (r) => {
        this.saving = false
        this.dialogRef.close(true)
      },
      error: (e: HttpErrorResponse) => {
        this.saving = false
        this.errorMessage = typeof e.error === 'string' ? e.error : 'An error has occurred'
        console.dir(e)
      }
    })
  }

  isInvalid(): boolean {
    return this.form.invalid
  }

}
