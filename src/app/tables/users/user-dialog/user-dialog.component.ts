import { AppRole, AppUser } from 'src/app/models/app-user';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, first, map } from 'rxjs';

import { AppUserService } from 'src/app/services/app-user.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RequireMatch } from 'src/app/validators/require-match';
import { MatSelectionListChange } from '@angular/material/list';

@Component({
  selector: 'app-user-dialog',
  templateUrl: './user-dialog.component.html',
  styleUrls: ['./user-dialog.component.scss']
})
export class UserDialogComponent implements OnInit {

  form: FormGroup

  userControl: FormControl
  roleControl: FormControl

  saving = false
  errorMessage = ''

  users$ = new Observable<AppUser[]>()

  roles$: Observable<AppRole[]>

  excludedRoles = [60]

  findSurname = ''
  searching = false

  constructor(
    public dialogRef: MatDialogRef<UserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AppUser | undefined,
    private userService: AppUserService
  ) {

    this.userControl = new FormControl(data, [Validators.required, RequireMatch])
    this.roleControl = new FormControl(data?.roles.map(r => r.id))


    this.form = new FormGroup({
      user: this.userControl,
      roles: this.roleControl,
    })

    // this.users$ = this.userControl.valueChanges.pipe(
    //   startWith(''),
    //   debounceTime(400),
    //   distinctUntilChanged(),
    //   switchMap((value: string) => {
    //     if (!!value && typeof value === 'string') {
    //       return this.findCandidates(value)
    //     } else {
    //       return of([])
    //     }
    //   })
    // )

    // const excludedRoles: number[] = []
    // if (!data) {
    //   // if new user then exclude fakeRole from options
    //   excludedRoles.push(this.fakeRole)
    // }



    this.roles$ = this.userService.getRoles(this.excludedRoles)
  }

  ngOnInit(): void {
  }

  save(): void {

    const data = this.form.value


    const body = {
      userName: data.user.userName,
      userRole: (<number[]>data.roles).map(r => {
        return {
          username: data.user.userName,
          roleId: r
        }
      })
    }

    // console.dir(body)

    this.userService.setRoles(body).pipe(first()).subscribe({
      next: r => {
        // console.dir(r)
        this.dialogRef.close(true)
      },
      error: e => {
        console.dir(e)
        this.errorMessage = "An error has occurred"
      }
    })
  }

  displayName(o: AppUser | null): string {
    if (!!o) {
      return `${o.displayName} [${o.userName}]`
    }
    return ''
  }

  isInvalid(): boolean {
    return this.form.invalid || this.saving || !this.form.touched || (typeof this.userControl.value !== 'object')
  }

  findCandidates(surname: string): Observable<AppUser[]> {

    const query = {
      surname: surname
    }

    return this.userService.getCandidateUsers(query)

  }

  searchCandidates(): void {
    console.log(this.findSurname)
    this.searching = true
    this.users$ = this.findCandidates(this.findSurname).pipe(
      map(results => {
        this.searching = false
        return results
      })
    )

    // this.findCandidates(this.findSurname).pipe(first()).subscribe({
    //   next: r => {
    //     console.dir(r)
    //   }
    // })

  }

  clear(): void {
    this.findSurname = ''
    this.users$ = new Observable<AppUser[]>()

    this.userControl.setValue(null)
  }

  onSelection(e: MatSelectionListChange): void {
    const u: AppUser = e.options[0].value
    this.userControl.setValue(u)
  }

  getUserName(): string {
    if(!!this.userControl.value) {
      const u: AppUser = this.userControl.value
      return `${u.displayName} - ${u.userName}`
    } else {
      return ''
    }
  }
}
