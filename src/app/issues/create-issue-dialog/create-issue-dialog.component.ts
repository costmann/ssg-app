import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, debounceTime, distinctUntilChanged, first, interval, map, of, startWith, switchMap, timer } from 'rxjs';

import { AppUser } from 'src/app/models/app-user';
import { AppUserService } from 'src/app/services/app-user.service';
import { Area } from 'src/app/models/area';
import { AreaService } from 'src/app/services/area.service';
import { AuthService } from 'src/app/services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { IssueService } from 'src/app/services/issue.service';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { MatSelectionListChange } from '@angular/material/list';
import { Plant } from 'src/app/models/plant';
import { PlantService } from 'src/app/services/plant.service';
import { RequireMatch } from 'src/app/validators/require-match';

@Component({
  selector: 'app-create-issue-dialog',
  templateUrl: './create-issue-dialog.component.html',
  styleUrls: ['./create-issue-dialog.component.scss']
})
export class CreateIssueDialogComponent implements OnInit {

  form: FormGroup

  areas$: Observable<Area[]>

  filteredPlants$: Observable<Plant[]>

  recipientControl: FormControl
  areaControl: FormControl
  plantControl: FormControl
  descriptionControl: FormControl
  notesControl: FormControl

  plantRequired = false
  plantDisabled = true

  saving = false
  errorMessage = ''

  //recipient: string | undefined

  selectingUser: boolean

  //selectedUser: AppUser | null = null

  findSurname = ''
  searching = false
  canChangeOwner: boolean

  users$ = new Observable<AppUser[]>()



  @ViewChild('search') search!: ElementRef

  constructor(
    public dialogRef: MatDialogRef<CreateIssueDialogComponent>,
    private issueService: IssueService,
    areaService: AreaService,
    plantService: PlantService,
    private userService: AppUserService,
    private authService: AuthService
  ) {

    this.recipientControl = new FormControl(null)
    this.areaControl = new FormControl(null, [Validators.required])
    this.plantControl = new FormControl({value: null, disabled: true}, [Validators.required, RequireMatch])
    this.descriptionControl = new FormControl(null, [Validators.required])
    this.notesControl = new FormControl(null)

    this.plantControl.disable()

    this.areas$ = areaService.getCurrentAreas()
    this.filteredPlants$ = this.plantControl.valueChanges.pipe(
      startWith(''),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((value: string) => {
        if (!!value) {
          return plantService.filterPlants(value)
        } else {
          return of([])
        }
      })
    )

    this.form = new FormGroup({
      recipient: this.recipientControl,
      area: this.areaControl,
      plant: this.plantControl,
      description: this.descriptionControl,
      notes: this.notesControl,
    })

    this.canChangeOwner = authService.isInRole(['61','62', '63'])
    this.selectingUser = this.canChangeOwner

  }

  ngOnInit(): void {
  }

  displayPlant(p: Plant | null): string {
    if (!!p) {
      return `${p.code} - ${p.name}`
    }
    return ''
  }

  onSubmit(): void {
    this.saving = true
    this.errorMessage = ''
    this.issueService.post(this.form.value).pipe(first()).subscribe({
      next: (r) => {
        this.saving = false
        this.dialogRef.close(r)
      },
      error: (e: HttpErrorResponse) => {
        this.saving = false
        this.errorMessage = typeof e.error === 'string' ? e.error : 'An error has occurred'
        console.dir(e)
      }
    })
  }

  isInvalid(): boolean {
    return this.form.invalid || !this.form.touched || (typeof this.plantControl.value !== 'object')
  }

  areaChanged(e: MatSelectChange): void {
    const a: Area = e.value

    if (a.plantSetting === 'N') {
      this.plantControl.setValue(null)
      this.plantControl.disable()
      this.plantDisabled = true
      this.plantRequired = false
      this.plantControl.removeValidators([Validators.required])
    } else {
      this.plantControl.enable()
      this.plantDisabled = false
      if (a.plantSetting === 'Y') {
        this.plantRequired = true
        this.plantControl.addValidators([Validators.required])
      } else {
        this.plantRequired = false
        this.plantControl.removeValidators([Validators.required])
      }
    }

    this.plantControl.updateValueAndValidity()

  }

  canGoNext(): boolean {
    return !this.findSurname || !!this.recipientControl.value
  }

  goNext(): void {
    this.selectingUser = false
  }

  searchCandidates(): void {
    this.searching = true
    this.users$ = this.userService.findUsers({ surname: this.findSurname, userName: this.findSurname }).pipe(
      map(results => {
        this.searching = false
        return results
      })
    )
  }

  clear(): void {
    this.findSurname = ''
    this.users$ = new Observable<AppUser[]>()
    // this.selectedUser = null
    this.recipientControl.setValue(null)
    //this.userControl.setValue(null)
  }

  onSelection(e: MatSelectionListChange): void {
    const u: AppUser = e.options[0].value
    // this.selectedUser = e.options[0].value
    this.recipientControl.setValue(u)
    //this.userControl.setValue(u)
  }

  goBack(): void {
    this.selectingUser = true
    this.clear()

    timer(50, -1).pipe(first()).subscribe(x => {
      this.search.nativeElement.focus()
    })

  }

  getRecipientName(): string {
    if (!!this.recipientControl.value) {
      return this.recipientControl.value.displayName
    } else {
      if (!!this.authService.userValue) {
        return this.authService.userValue?.displayName
      } else {
        return ''
      }
    }
  }

}
