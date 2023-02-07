import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Equipment } from 'src/app/models/equipment';

@Component({
  selector: 'app-equipment-delete-dialog',
  templateUrl: './equipment-delete-dialog.component.html',
  styleUrls: ['./equipment-delete-dialog.component.scss']
})
export class EquipmentDeleteDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<EquipmentDeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Equipment
  ) { }

  ngOnInit(): void {
  }

}
