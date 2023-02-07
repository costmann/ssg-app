import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, debounceTime, distinctUntilChanged, first, of, startWith, switchMap } from 'rxjs';

import { Area } from 'src/app/models/area';
import { AreaService } from 'src/app/services/area.service';
import { HttpErrorResponse } from '@angular/common/http';
import { IssueService } from 'src/app/services/issue.service';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
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

  areaControl: FormControl
  plantControl: FormControl
  descriptionControl: FormControl
  notesControl: FormControl

  plantRequired = false
  plantDisabled = true

  saving = false
  errorMessage = ''

  constructor(
    public dialogRef: MatDialogRef<CreateIssueDialogComponent>,
    private issueService: IssueService,
    areaService: AreaService,
    plantService: PlantService
  ) {
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
      area: this.areaControl,
      plant: this.plantControl,
      description: this.descriptionControl,
      notes: this.notesControl,
    })
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

  }

}
