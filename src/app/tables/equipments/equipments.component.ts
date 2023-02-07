import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription, debounceTime, distinctUntilChanged, first, fromEvent, merge, tap } from 'rxjs';

import { ApiResultDataSource } from 'src/app/datasources/api-result.datasource';
import { Equipment } from 'src/app/models/equipment';
import { EquipmentDeleteDialogComponent } from './equipment-delete-dialog/equipment-delete-dialog.component';
import { EquipmentDialogComponent } from './equipment-dialog/equipment-dialog.component';
import { EquipmentService } from 'src/app/services/equipment.service';
import { Filter } from 'src/app/models/filter';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-equipments',
  templateUrl: './equipments.component.html',
  styleUrls: ['./equipments.component.scss']
})
export class EquipmentsComponent implements OnInit, AfterViewInit, OnDestroy {

  displayedColumns = ["code", "name", "issues", "actions"]

  dataSource: ApiResultDataSource<Equipment>

  filter: Filter

  @ViewChild(MatPaginator) paginator!: MatPaginator
  @ViewChild(MatSort) sort!: MatSort

  tableSubscription : Subscription | undefined
  keyupSubscription : Subscription | undefined

  @ViewChild('search') input!: ElementRef

  currentRow: Equipment | undefined

  constructor(private equipmentService: EquipmentService, public dialog: MatDialog) {
    this.dataSource = new ApiResultDataSource(equipmentService)


    const json = window.sessionStorage.getItem('EquipmentFilter')
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

    window.sessionStorage.setItem('EquipmentFilter', JSON.stringify(this.filter))

    this.dataSource.load(this.filter)
  }

  openDialog(e: Equipment | undefined = undefined): void {

    const dialogRef = this.dialog.open(EquipmentDialogComponent, {
      disableClose: true,
      width: '500px',
      data: e
    })

    dialogRef.afterClosed().pipe(first()).subscribe((result) => {
      if (!!result) {
        this.loadData()
      }
    })

  }

  deleteDialog(e: Equipment): void {

    const dialogRef = this.dialog.open(EquipmentDeleteDialogComponent, {
      width: '500px',
      data: e
    });

    dialogRef.afterClosed().pipe(first()).subscribe((result) => {
      if (!!result) {
        this.equipmentService.delete(e).subscribe({
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

  restore(e: Equipment): void {
    this.equipmentService.restore(e).pipe(first()).subscribe({
      next: () => {
        this.loadData()
      }, error: (e) => {
        console.log(e)
      }
    })
  }

  clearSearch(): void {
    this.filter.filterQuery = ''
    this.loadData()
  }

  onMouseEvent(e: Equipment | undefined = undefined): void {
    this.currentRow = e
  }
}
