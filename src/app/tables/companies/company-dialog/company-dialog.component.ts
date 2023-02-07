import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { first } from 'rxjs';
import { Company } from 'src/app/models/company';
import { CompanyService } from 'src/app/services/company.service';

@Component({
  selector: 'app-company-dialog',
  templateUrl: './company-dialog.component.html',
  styleUrls: ['./company-dialog.component.scss']
})
export class CompanyDialogComponent implements OnInit {

  form: FormGroup

  idControl: FormControl
  nameControl: FormControl

  saving = false

  errorMessage = ''

  constructor(
    public dialogRef: MatDialogRef<CompanyDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Company | undefined,
    private companyService: CompanyService
  ) {
    this.idControl = new FormControl(data?.id)
    this.nameControl = new FormControl(data?.businessName, [Validators.required])

    this.form = new FormGroup({
      id: this.idControl,
      businessName: this.nameControl,
    })
  }

  ngOnInit(): void {
  }

  add(): void {
    this.saving = true
    this.companyService.post(this.form.value).pipe(first()).subscribe({
      next: () => {
        this.saving = false
        this.dialogRef.close(true)
      },
      error: (e) => {
        console.dir(e)
        this.errorMessage = 'An error has occurred'
        this.saving = false
      }
    })
  }

  update(): void {
    this.saving = true
    this.companyService.put(this.form.value).pipe(first()).subscribe({
      next: () => {
        this.saving = false
        this.dialogRef.close(true)
      },
      error: (e) => {
        console.dir(e)
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
