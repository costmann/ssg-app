import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Plant } from 'src/app/models/plant';

@Component({
  selector: 'app-plant-delete-dialog',
  templateUrl: './plant-delete-dialog.component.html',
  styleUrls: ['./plant-delete-dialog.component.scss']
})
export class PlantDeleteDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<PlantDeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Plant
  ) { }

  ngOnInit(): void {
  }

}
