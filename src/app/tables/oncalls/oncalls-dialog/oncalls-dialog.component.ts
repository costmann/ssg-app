import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, debounceTime, distinctUntilChanged, of, startWith, switchMap, first } from 'rxjs';

import { AppUser } from 'src/app/models/app-user';
import { AppUserService } from 'src/app/services/app-user.service';
import { Area } from 'src/app/models/area';
import { OnCallService } from 'src/app/services/oncall.service';
import { RequireMatch } from 'src/app/validators/require-match';
import { Roles } from 'src/app/models/roles';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';

interface OnCallPeriod {
  year: number
  week: number
  start: Date
  end: Date
  areaId: number | undefined
}

@Component({
  selector: 'app-oncalls-dialog',
  templateUrl: './oncalls-dialog.component.html',
  styleUrls: ['./oncalls-dialog.component.scss']
})
export class OncallsDialogComponent implements OnInit {

  form: FormGroup
  yearControl: FormControl
  weekControl: FormControl
  areaControl: FormControl
  onCallControl: FormControl

  areas$: Observable<Area[]>
  onCalls$: Observable<AppUser[]>

  saving = false
  errorMessage = ''

  constructor(
    public dialogRef: MatDialogRef<OncallsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: OnCallPeriod,
    private onCallService: OnCallService,
    userService: AppUserService
  ) {
    this.areas$ = onCallService.getOnCallAreas()

    this.yearControl = new FormControl(data.year, [Validators.required])
    this.weekControl = new FormControl(data.week, [Validators.required])
    this.areaControl = new FormControl(data.areaId, [Validators.required])
    this.onCallControl = new FormControl(null, [Validators.required, RequireMatch])

    this.form = new FormGroup({
      year: this.yearControl,
      week: this.weekControl,
      areaId: this.areaControl,
      onCall: this.onCallControl,
    })

    this.onCalls$ = this.onCallControl.valueChanges.pipe(
      startWith(''),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((value: string) => {
        if (!!value && typeof value === 'string') {
          return userService.getUsers(value, Roles.ON_CALL)
        } else {
          return of([])
        }
      })
    )

  }

  ngOnInit(): void {
  }

  isInvalid(): boolean {
    return this.form.invalid || this.saving || !this.form.touched
  }

  displayName(user: AppUser | null): string {
    if (!!user) {
      return user.displayName
    }
    return ''
  }

  save(): void {

    console.dir(this.form.value)

    this.saving = true
    this.onCallService.post(this.form.value).pipe(first()).subscribe({
      next: () => {
        this.saving = false
        this.dialogRef.close(true)
      },
      error: (e: HttpErrorResponse) => {
        console.dir(e)
        this.errorMessage = typeof e.error === 'string' && (e.error.length < 50) ? e.error : 'An error has occurred'
        this.saving = false
      }
    })

  }
}
