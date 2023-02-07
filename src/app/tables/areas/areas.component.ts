import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription, debounceTime, distinctUntilChanged, first, fromEvent, merge, tap } from 'rxjs';

import { ApiResultDataSource } from 'src/app/datasources/api-result.datasource';
import { Area } from 'src/app/models/area';
import { AreaDeleteDialogComponent } from './area-delete-dialog/area-delete-dialog.component';
import { AreaDialogComponent } from './area-dialog/area-dialog.component';
import { AreaService } from './../../services/area.service';
import { AttributesDialogComponent } from './attributes-dialog/attributes-dialog.component';
import { Filter } from 'src/app/models/filter';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-areas',
  templateUrl: './areas.component.html',
  styleUrls: ['./areas.component.scss']
})
export class AreasComponent implements OnInit, AfterViewInit, OnDestroy {

  displayedColumns = ["code", "name", "responsible", "delegate", "plant", "issues", "attributes", "actions"]

  dataSource: ApiResultDataSource<Area>

  filter: Filter

  @ViewChild(MatPaginator) paginator!: MatPaginator
  @ViewChild(MatSort) sort!: MatSort

  tableSubscription : Subscription | undefined
  keyupSubscription : Subscription | undefined

  @ViewChild('search') input!: ElementRef

  currentRow: Area | undefined

  dict: { [key: string]: string } = {
    'O': 'Optional',
    'Y': 'Yes',
    'N': 'No'
  }

  icon: { [key: string]: string } = {
    'O': 'indeterminate_check_box',
    'Y': 'check_box',
    'N': 'check_box_outline_blank'
  }

  constructor(private areaService: AreaService, public dialog: MatDialog) {
    this.dataSource = new ApiResultDataSource(areaService)

    const json = window.sessionStorage.getItem('AreaFilter')
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

    window.sessionStorage.setItem('AreaFilter', JSON.stringify(this.filter))

    this.dataSource.load(this.filter)
  }

  openDialog(a: Area | undefined = undefined): void {

    const dialogRef = this.dialog.open(AreaDialogComponent, {
      disableClose: true,
      width: '500px',
      data: a
    })

    dialogRef.afterClosed().pipe(first()).subscribe((result) => {
      if (!!result) {
        this.loadData()
      }
    })

  }

  deleteDialog(a: Area): void {

    const dialogRef = this.dialog.open(AreaDeleteDialogComponent, {
      width: '500px',
      data: a
    });

    dialogRef.afterClosed().pipe(first()).subscribe((result) => {
      if (!!result) {
        this.areaService.delete(a).subscribe({
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

  restore(a: Area): void {
    this.areaService.restore(a).pipe(first()).subscribe({
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

  onMouseEvent(a: Area | undefined = undefined): void {
    this.currentRow = a
  }

  openAttributes(a: Area): void {
    const dialogRef = this.dialog.open(AttributesDialogComponent, {
      disableClose: true,
      width: '600px',
      data: a
    })

    const sub = dialogRef.componentInstance.onChange.subscribe(() => {
      // debugger
      this.loadData()
    })

    dialogRef.afterClosed().pipe(first()).subscribe(() => {
      sub.unsubscribe()
    })

  }

}
