import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { System } from 'src/app/models/system';

@Component({
  selector: 'app-system-delete-dialog',
  templateUrl: './system-delete-dialog.component.html',
  styleUrls: ['./system-delete-dialog.component.scss']
})
export class SystemDeleteDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<SystemDeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: System
  ) { }

  ngOnInit(): void {
  }

}
