import { Component, OnInit } from '@angular/core';
import { Observable, first } from 'rxjs';

import { Area } from 'src/app/models/area';
import { ArrayDataSource } from 'src/app/datasources/array.datasource';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { OnCall } from 'src/app/models/oncall';
import { OnCallFilter } from 'src/app/models/filter';
import { OnCallService } from 'src/app/services/oncall.service';
import { OncallsDeleteDialogComponent } from './oncalls-delete-dialog/oncalls-delete-dialog.component';
import { OncallsDialogComponent } from './oncalls-dialog/oncalls-dialog.component';

@Component({
  selector: 'app-oncalls',
  templateUrl: './oncalls.component.html',
  styleUrls: ['./oncalls.component.scss']
})
export class OncallsComponent implements OnInit {

  dataSource: ArrayDataSource<OnCall>

  filter: OnCallFilter

  areas$: Observable<Area[]>

  displayedColumns = [
    "onCallUser",
    "onCallName",
    "area",
    "actions"
  ]

  currentRow: OnCall | undefined

  canAdd = false

  constructor(private service: OnCallService, public dialog: MatDialog) {

    this.dataSource = new ArrayDataSource(service)

    const json = window.sessionStorage.getItem('OnCallFilter')
    if (!!json) {
      this.filter = JSON.parse(json)
    } else {
      this.filter = new OnCallFilter()
    }

    this.areas$ = service.getOnCallAreas()
  }

  ngOnInit(): void {
    this.loadData()
  }

  applyFilterArea(event: MatSelectChange): void {
    this.filter.area = event.value
    this.loadData()
  }

  applyFilter(): void {
    this.loadData()
  }

  loadData(): void {

    const today = new Date()
    console.log(today)
    this.canAdd = this.ISOweekEnd() > today

    window.sessionStorage.setItem('OnCallFilter', JSON.stringify(this.filter))
    this.dataSource.load(this.filter)
  }

  onMouseEvent(u: OnCall | undefined = undefined): void {
    this.currentRow = u
  }

  deleteDialog(o: OnCall): void {

    const dialogRef = this.dialog.open(OncallsDeleteDialogComponent, {
      width: '500px',
      data: o
    });

    dialogRef.afterClosed().pipe(first()).subscribe((result) => {
      if (!!result) {
        this.service.delete(o.id).subscribe({
          next: () => {
            this.loadData()
          },
          error: (e) => {
            console.log(e)
          }
        })
      }
    })

  }

  addDialog(): void {
    const dialogRef = this.dialog.open(OncallsDialogComponent, {
      disableClose: true,
      width: '500px',
      data: {
        'year': this.filter.year,
        'week': this.filter.week,
        'areaId': this.filter.area,
        'start': this.ISOweekStart(),
        'end': this.ISOweekEnd(),
      }
    })

    dialogRef.afterClosed().pipe(first()).subscribe((result) => {
      if (!!result) {
        this.loadData()
      }
    })
  }

  getISOweekStart(y: number, w: number): Date {
    var simple = new Date(y, 0, 1 + (w - 1) * 7)
    var dow = simple.getDay()
    var ISOweekStart = simple
    if (dow <= 4) {
        ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1)
    } else {
        ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay())
    }
    ISOweekStart.setHours(7)
    return ISOweekStart
  }

  ISOweekStart(): Date {
    return this.getISOweekStart(this.filter.year, this.filter.week)
  }

  ISOweekEnd(): Date {
    var start = this.getISOweekStart(this.filter.year, this.filter.week)
    var end = start
    end.setDate(start.getDate() + 7)
    return end
  }
}
