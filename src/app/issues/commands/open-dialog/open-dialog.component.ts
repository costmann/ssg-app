import { AuthService } from './../../../services/auth.service';
import { UserPipe } from './../../../pipes/user.pipe';
import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { debounceTime, distinctUntilChanged, first, map, Observable, of, startWith, switchMap, Subscription } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { Command } from 'src/app/models/command';
import { IssueService } from 'src/app/services/issue.service';
import { Issue } from 'src/app/models/issue';
import { Equipment } from 'src/app/models/equipment';
import { RequireMatch } from 'src/app/validators/require-match';
import { AppUserService } from 'src/app/services/app-user.service';
import { Roles } from 'src/app/models/roles';
import { AppUser } from 'src/app/models/app-user';
import { IssueAttributeService } from 'src/app/services/issue-attribute.service';
import { IssueAttribute } from 'src/app/models/issue-attribute';
import { Item } from 'src/app/models/item';

@Component({
  selector: 'app-open-dialog',
  templateUrl: './open-dialog.component.html',
  styleUrls: ['./open-dialog.component.scss']
})
export class OpenDialogComponent implements OnInit, OnDestroy {

  form: FormGroup
  formAttributes: FormGroup

  idControl: FormControl
  recipientControl: FormControl
  notesControl: FormControl
  commandControl: FormControl

  plantRequired = false
  plantDisabled = true

  saving = false
  errorMessage = ''

  recipients$: Observable<AppUser[]>

  attributes: IssueAttribute[] = []
  observables:{ [key: string]: Observable<Item[]> } = {}

  subscription: Subscription

  constructor(
    public dialogRef: MatDialogRef<OpenDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {issue: Issue, command: Command},
    private issueService: IssueService,
    private userService: AppUserService,
    private issueAttributeService: IssueAttributeService,
    private user: UserPipe,
  ) {

    this.subscription = this.getAttributes()

    this.idControl = new FormControl(data.issue.id, [Validators.required])
    this.recipientControl = new FormControl(null, [Validators.required, RequireMatch])
    this.notesControl = new FormControl(null)
    this.commandControl = new FormControl(data.command.commandName)

    this.formAttributes = new FormGroup({})

    this.form = new FormGroup({
      id: this.idControl,
      recipient: this.recipientControl,
      notes: this.notesControl,
      commandName: this.commandControl,
      attributes: this.formAttributes
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
    this.userService.getUser(this.data.issue.delegateUser).pipe(first()).subscribe({
      next: user => {
        this.recipientControl.setValue(user)
      }
    })
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }

  onSubmit(): void {
    // console.table(this.form.value)
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
        // console.dir(e)
      }
    })
  }

  isInvalid(): boolean {
    return this.form.invalid
  }

  displayName(user: AppUser | null): string {
    // console.dir(user)
    if (!!user) {
      return user.displayName
    }
    return ''
  }

  equipmentName(e: Equipment | null): string {
    if (!!e) {
      return `${e.code} - ${e.name}`
    }
    return ''
  }

  getAttributes(): Subscription {

    return this.issueAttributeService.resetAttributes(this.data.issue.id).pipe(
      switchMap(() => this.issueAttributeService.getAttributes(this.data.issue.id))
    ).subscribe({
      next: (attributes) => {
        // console.table(attributes)
        this.attributes = attributes
        this.attributes.forEach(a => {

          const validators: ValidatorFn[] = []
          if (a.required) {
            validators.push(Validators.required)
          }
          this.formAttributes.addControl(a.id.toString(), new FormControl(a.value, validators))

          if (a.dataTypeElement === 'select') {
            this.observables[a.dataTypeName] = this.issueAttributeService.getItems(a.dataTypeName)
          }
        })
      }
    })

  }

  getFormControl(id: number): FormControl {
    return this.formAttributes.controls[id.toString()] as FormControl
  }

  cancel(): void {
    this.issueAttributeService.resetAttributes(this.data.issue.id, false).pipe(first()).subscribe({
      next: () => {
        this.dialogRef.close(false)
      }
    })
  }
}
