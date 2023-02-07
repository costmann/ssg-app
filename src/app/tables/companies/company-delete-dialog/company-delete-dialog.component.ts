import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Company } from 'src/app/models/company';

@Component({
  selector: 'app-company-delete-dialog',
  templateUrl: './company-delete-dialog.component.html',
  styleUrls: ['./company-delete-dialog.component.scss']
})
export class CompanyDeleteDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<CompanyDeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Company
  ) { }

  ngOnInit(): void {
  }

}
