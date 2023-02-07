import { OnCall } from './../../../models/oncall';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-oncalls-delete-dialog',
  templateUrl: './oncalls-delete-dialog.component.html',
  styleUrls: ['./oncalls-delete-dialog.component.scss']
})
export class OncallsDeleteDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<OncallsDeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: OnCall
  ) { }

  ngOnInit(): void {
  }

}
