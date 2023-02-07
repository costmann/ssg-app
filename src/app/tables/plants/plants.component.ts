import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription, debounceTime, distinctUntilChanged, first, fromEvent, merge, tap } from 'rxjs';

import { ApiResultDataSource } from 'src/app/datasources/api-result.datasource';
import { Filter } from 'src/app/models/filter';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Plant } from './../../models/plant';
import { PlantDeleteDialogComponent } from './plant-delete-dialog/plant-delete-dialog.component';
import { PlantDialogComponent } from './plant-dialog/plant-dialog.component';
import { PlantService } from 'src/app/services/plant.service';

@Component({
  selector: 'app-plants',
  templateUrl: './plants.component.html',
  styleUrls: ['./plants.component.scss']
})
export class PlantsComponent implements OnInit, AfterViewInit, OnDestroy {

  displayedColumns = ["code", "site", "name", "issues", "actions"]

  fields = [
    {name:'code', description:'Code'},
    {name:'siteName', description:'Area'},
    {name:'name', description:'Name'},
  ]

  dataSource: ApiResultDataSource<Plant>

  filter: Filter

  @ViewChild(MatPaginator) paginator!: MatPaginator
  @ViewChild(MatSort) sort!: MatSort

  tableSubscription : Subscription | undefined
  keyupSubscription : Subscription | undefined

  @ViewChild('search') input!: ElementRef

  currentRow: Plant | undefined

  constructor(private plantService: PlantService, public dialog: MatDialog) {
    this.dataSource = new ApiResultDataSource(plantService)

    const json = window.sessionStorage.getItem('PlantFilter')
    if (!!json) {
      this.filter = JSON.parse(json)
    } else {
      this.filter = new Filter()
      this.filter.sortColumn = 'name'
      this.filter.filterColumn = 'name'
    }

  }

  ngOnInit(): void {
    this.loadData()
  }

  ngAfterViewInit(): void {

    this.tableSubscription = merge(this.sort.sortChange, this.paginator.page)
      .pipe(tap(() => this.loadData()))
      .subscribe()

    this.keyupSubscription = fromEvent(this.input.nativeElement, 'keyup')
      .pipe(
          debounceTime(150),
          distinctUntilChanged(),
          tap(() => {
              this.paginator.pageIndex = 0
              this.loadData()
          })
      )
      .subscribe()

  }

  ngOnDestroy(): void {
    this.tableSubscription?.unsubscribe()
    this.keyupSubscription?.unsubscribe()
  }

  loadData(): void {

    this.filter.pageIndex =  !!this.paginator ? this.paginator.pageIndex : this.filter.pageIndex
    this.filter.pageSize =  !!this.paginator ? this.paginator.pageSize : this.filter.pageSize
    this.filter.sortColumn =  !!this.sort ? this.sort.active : this.filter.sortColumn
    this.filter.sortDirection =  !!this.sort ? this.sort.direction : this.filter.sortDirection

    window.sessionStorage.setItem('PlantFilter', JSON.stringify(this.filter))

    this.dataSource.load(this.filter)
  }

  openDialog(p: Plant | undefined = undefined): void {

    const dialogRef = this.dialog.open(PlantDialogComponent, {
      disableClose: true,
      width: '500px',
      data: p
    })

    dialogRef.afterClosed().pipe(first()).subscribe((result) => {
      if (!!result) {
        this.loadData()
      }
    })

  }

  deleteDialog(p: Plant): void {

    const dialogRef = this.dialog.open(PlantDeleteDialogComponent, {
      width: '500px',
      data: p
    });

    dialogRef.afterClosed().pipe(first()).subscribe((result) => {
      if (!!result) {
        this.plantService.delete(p).subscribe({
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

  restore(p: Plant): void {
    this.plantService.restore(p).pipe(first()).subscribe({
      next: () => {
        this.loadData()
      },
      error: (e) => {
        console.log(e)
      }
    })
  }

  clearSearch(): void {
    this.filter.filterQuery = ''
    this.loadData()
  }

  onMouseEvent(p: Plant | undefined = undefined): void {
    this.currentRow = p
  }
}
