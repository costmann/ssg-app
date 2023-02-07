import { AreaService } from './../../../services/area.service';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Area } from 'src/app/models/area';
import { debounceTime, distinctUntilChanged, first, Observable, of, startWith, switchMap } from 'rxjs';
import { RequireMatch } from 'src/app/validators/require-match';
import { HttpErrorResponse } from '@angular/common/http';
import { AppUser } from 'src/app/models/app-user';
import { AppUserService } from 'src/app/services/app-user.service';
import { Roles } from 'src/app/models/roles';

@Component({
  selector: 'app-area-dialog',
  templateUrl: './area-dialog.component.html',
  styleUrls: ['./area-dialog.component.scss']
})
export class AreaDialogComponent implements OnInit {

  form: FormGroup

  idControl: FormControl
  codeControl: FormControl
  nameControl: FormControl
  responsibleControl: FormControl
  delegateControl: FormControl
  plantSettingControl: FormControl
  // onCallSettingControl: FormControl

  saving = false
  errorMessage = ''

  responsibles$: Observable<AppUser[]>
  delegates$: Observable<AppUser[]>

  constructor(
    public dialogRef: MatDialogRef<AreaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Area | undefined,
    private areaService: AreaService,
    private userService: AppUserService
  ) {

    this.idControl = new FormControl(data?.id)
    this.codeControl = new FormControl(data?.code, [Validators.required])
    this.nameControl = new FormControl(data?.name, [Validators.required])
    this.plantSettingControl = new FormControl(data?.plantSetting)
    this.responsibleControl = new FormControl(null, [Validators.required, RequireMatch])
    this.delegateControl = new FormControl(null, [RequireMatch])

    this.form = new FormGroup({
      id: this.idControl,
      code: this.codeControl,
      name: this.nameControl,
      plantSetting: this.plantSettingControl,
      responsible: this.responsibleControl,
      delegate: this.delegateControl,
    })

    this.responsibles$ = this.responsibleControl.valueChanges.pipe(
      startWith(''),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((value: string) => {
        if (!!value && typeof value === 'string') {
          return userService.getUsers(value, Roles.RESPONSIBLE)
        } else {
          return of([])
        }
      })
    )

    this.delegates$ = this.delegateControl.valueChanges.pipe(
      startWith(''),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((value: string) => {
        if (!!value && typeof value === 'string') {
          return userService.getUsers(value, Roles.DELEGATES)
        } else {
          return of([])
        }
      })
    )
  }

  ngOnInit(): void {
    if (!!this.data) {
      this.userService.getUser(this.data.responsibleUser).pipe(first()).subscribe({
        next: o => {
          this.responsibleControl.setValue(o)
        }
      })

      if (!!this.data.delegateUser) {
        this.userService.getUser(this.data.delegateUser).pipe(first()).subscribe({
          next: o => {
            this.delegateControl.setValue(o)
          }
        })
      }

    }
  }

  // getOperator(username: string): Operator | null {
  //   return this.operatorService.getOperator(username).pipe(first()).subscribe({
  //     next: o => {
  //       return o
  //     }
  //   })
  // }

  add(): void {
    this.saving = true
    this.areaService.post(this.form.value).pipe(first()).subscribe({
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

  update(id: number): void {
    this.saving = true
    this.areaService.put(id, this.form.value).pipe(first()).subscribe({
      next: () => {
        this.saving = false
        this.dialogRef.close(true)
      },
      error: (e: HttpErrorResponse) => {
        console.log(e)
        this.errorMessage = typeof e.error === 'string' && (e.error.length < 50) ? e.error : 'An error has occurred'
        this.saving = false
      }
    })
  }

  save(): void {
    if (!!this.idControl.value) {
      this.update(parseInt(this.idControl.value))
    } else {
      this.add()
    }
  }

  displayName(user: AppUser | null): string {
    if (!!user) {
      return user.displayName
    }
    return ''
  }

  isInvalid(): boolean {
    return this.form.invalid || this.saving || !this.form.touched || (typeof this.responsibleControl.value !== 'object') || ((typeof this.delegateControl.value !== 'object') && (this.delegateControl.value !== ''))
  }
}
