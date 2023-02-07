import { System } from './../../../models/system';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SystemService } from 'src/app/services/system.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { first } from 'rxjs';

@Component({
  selector: 'app-system-dialog',
  templateUrl: './system-dialog.component.html',
  styleUrls: ['./system-dialog.component.scss']
})
export class SystemDialogComponent implements OnInit {

  form: FormGroup

  idControl: FormControl
  codeControl: FormControl
  nameControl: FormControl

  saving = false

  errorMessage = ''

  constructor(
    public dialogRef: MatDialogRef<SystemDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: System | undefined,
    private systemService: SystemService
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
    this.systemService.post(this.form.value).pipe(first()).subscribe({
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
    this.systemService.put(this.form.value).pipe(first()).subscribe({
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
