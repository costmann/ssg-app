import { Step } from 'src/app/models/step';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { first } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { StepService } from 'src/app/services/step.service';

@Component({
  selector: 'app-edit-note-dialog',
  templateUrl: './edit-note-dialog.component.html',
  styleUrls: ['./edit-note-dialog.component.scss']
})
export class EditNoteDialogComponent implements OnInit {

  form: FormGroup

  idControl: FormControl
  notesControl: FormControl

  plantRequired = false
  plantDisabled = true

  saving = false
  errorMessage = ''

  constructor(
    public dialogRef: MatDialogRef<EditNoteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Step,
    private stepService: StepService,
  ) {

    this.idControl = new FormControl(data.id, [Validators.required])
    this.notesControl = new FormControl(data.notes)

    this.form = new FormGroup({
      id: this.idControl,
      notes: this.notesControl,
    })
  }
  ngOnInit(): void {
  }

  onSubmit(): void {
    this.saving = true
    this.errorMessage = ''
    this.stepService.updateNote(this.form.value).pipe(first()).subscribe({
      next: (r) => {
        this.saving = false
        this.dialogRef.close(true)
      },
      error: (e: HttpErrorResponse) => {
        this.saving = false
        this.errorMessage = typeof e.error === 'string' ? e.error : 'An error has occurred'
        console.dir(e)
      }
    })

  }

  isInvalid(): boolean {
    return this.form.invalid
  }

}
