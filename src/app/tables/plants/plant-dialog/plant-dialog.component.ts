import { Plant } from './../../../models/plant';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PlantService } from 'src/app/services/plant.service';
import { first, Observable } from 'rxjs';
import { Site } from 'src/app/models/site';

@Component({
  selector: 'app-plant-dialog',
  templateUrl: './plant-dialog.component.html',
  styleUrls: ['./plant-dialog.component.scss']
})
export class PlantDialogComponent implements OnInit {

  form: FormGroup

  idControl: FormControl
  codeControl: FormControl
  nameControl: FormControl
  siteControl: FormControl

  saving = false

  sites$: Observable<Site[]>

  errorMessage = ''

  constructor(
    public dialogRef: MatDialogRef<PlantDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Plant | undefined,
    private plantService: PlantService
  ) {

    this.idControl = new FormControl(data?.id)
    this.codeControl = new FormControl(data?.code, [Validators.required])
    this.nameControl = new FormControl(data?.name, [Validators.required])
    this.siteControl = new FormControl(data?.siteId, [Validators.required])

    this.form = new FormGroup({
      id: this.idControl,
      code: this.codeControl,
      name: this.nameControl,
      siteId: this.siteControl,
    })

    this.sites$ = plantService.getSites()
  }

  ngOnInit(): void {
  }

  add(): void {
    this.saving = true
    this.plantService.post(this.form.value).pipe(first()).subscribe({
      next: () => {
        this.saving = false
        this.dialogRef.close(true)
      },
      error: () => {
        this.errorMessage = 'An error has occurred'
        this.saving = false
      }
    })
  }

  update(): void {
    this.saving = true
    this.plantService.put(this.form.value).pipe(first()).subscribe({
      next: () => {
        this.saving = false
        this.dialogRef.close(true)
      },
      error: () => {
        this.errorMessage = 'An error has occurred'
        this.saving = false
      }
    })
  }

  save(): void {
    if (!!this.idControl.value) {
      this.update()
    } else {
      this.add()
    }
  }

}
