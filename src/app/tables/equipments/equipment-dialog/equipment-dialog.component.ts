import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { first } from 'rxjs';
import { Equipment } from 'src/app/models/equipment';
import { EquipmentService } from 'src/app/services/equipment.service';

@Component({
  selector: 'app-equipment-dialog',
  templateUrl: './equipment-dialog.component.html',
  styleUrls: ['./equipment-dialog.component.scss']
})
export class EquipmentDialogComponent implements OnInit {

  form: FormGroup

  idControl: FormControl
  codeControl: FormControl
  nameControl: FormControl

  saving = false

  errorMessage = ''

  constructor(
    public dialogRef: MatDialogRef<EquipmentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Equipment | undefined,
    private equipmentService: EquipmentService
  ) {
    this.idControl = new FormControl(data?.id)
    this.codeControl = new FormControl(data?.code, [Validators.required])
    this.nameControl = new FormControl(data?.name, [Validators.required])

    this.form = new FormGroup({
      id: this.idControl,
      code: this.codeControl,
      name: this.nameControl,
    })
  }

  ngOnInit(): void {
  }

  add(): void {
    this.saving = true
    this.equipmentService.post(this.form.value).pipe(first()).subscribe({
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
    this.equipmentService.put(this.form.value).pipe(first()).subscribe({
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
