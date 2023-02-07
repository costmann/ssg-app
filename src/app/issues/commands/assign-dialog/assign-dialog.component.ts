import { AppUser } from 'src/app/models/app-user';
import { Roles } from './../../../models/roles';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { debounceTime, distinctUntilChanged, first, Observable, of, startWith, switchMap } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { Command } from 'src/app/models/command';
import { IssueService } from 'src/app/services/issue.service';
import { Issue } from 'src/app/models/issue';
import { RequireMatch } from 'src/app/validators/require-match';
import { AppUserService } from 'src/app/services/app-user.service';

@Component({
  selector: 'app-assign-dialog',
  templateUrl: './assign-dialog.component.html',
  styleUrls: ['./assign-dialog.component.scss']
})
export class AssignDialogComponent implements OnInit {

  form: FormGroup

  idControl: FormControl
  recipientControl: FormControl
  notesControl: FormControl
  commandControl: FormControl

  plantRequired = false
  plantDisabled = true

  saving = false
  errorMessage = ''

  recipients$: Observable<AppUser[]>

  constructor(
    public dialogRef: MatDialogRef<AssignDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {issue: Issue, command: Command},
    private issueService: IssueService,
    userService: AppUserService,
  ) {

    this.idControl = new FormControl(data.issue.id, [Validators.required])
    this.recipientControl = new FormControl(null, [Validators.required, RequireMatch])
    this.notesControl = new FormControl(null)
    this.commandControl = new FormControl(data.command.commandName)

    this.form = new FormGroup({
      id: this.idControl,
      recipient: this.recipientControl,
      notes: this.notesControl,
      commandName: this.commandControl,
    })

    this.recipients$ = this.recipientControl.valueChanges.pipe(
      startWith(''),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((value: string) => {
        if (!!value && typeof value === 'string') {
          return userService.getUsers(value, Roles.IN_CHARGE)
        } else {
          return of([])
        }
      })
    )
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    this.saving = true
    this.errorMessage = ''
    this.issueService.exec(this.form.value).pipe(first()).subscribe({
      next: (issue: Issue) => {
        this.saving = false
        this.dialogRef.close(issue)
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

  displayName(user: AppUser | null): string {
    if (!!user) {
      return user.displayName
    }
    return ''
  }

}
