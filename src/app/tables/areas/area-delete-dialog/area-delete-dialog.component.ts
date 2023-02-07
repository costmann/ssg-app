import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Area } from 'src/app/models/area';
import { AreaService } from 'src/app/services/area.service';

@Component({
  selector: 'app-area-delete-dialog',
  templateUrl: './area-delete-dialog.component.html',
  styleUrls: ['./area-delete-dialog.component.scss']
})
export class AreaDeleteDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<AreaDeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Area
  ) { }

  ngOnInit(): void {
  }

}
