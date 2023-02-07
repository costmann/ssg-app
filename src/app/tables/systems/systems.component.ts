import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription, debounceTime, distinctUntilChanged, first, fromEvent, merge, tap } from 'rxjs';

import { ApiResultDataSource } from 'src/app/datasources/api-result.datasource';
import { Filter } from 'src/app/models/filter';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { System } from './../../models/system';
import { SystemDeleteDialogComponent } from './system-delete-dialog/system-delete-dialog.component';
import { SystemDialogComponent } from './system-dialog/system-dialog.component';
import { SystemService } from 'src/app/services/system.service';

@Component({
  selector: 'app-systems',
  templateUrl: './systems.component.html',
  styleUrls: ['./systems.component.scss']
})
export class SystemsComponent implements OnInit, AfterViewInit, OnDestroy {

  displayedColumns = ["code", "name", "issues", "actions"]

  dataSource: ApiResultDataSource<System>

  filter: Filter

  @ViewChild(MatPaginator) paginator!: MatPaginator
  @ViewChild(MatSort) sort!: MatSort

  tableSubscription : Subscription | undefined
  keyupSubscription : Subscription | undefined

  @ViewChild('search') input!: ElementRef

  currentRow: System | undefined

  constructor(private systemService: SystemService, public dialog: MatDialog) {
    this.dataSource = new ApiResultDataSource(systemService)

    const json = window.sessionStorage.getItem('SystemFilter')
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

    window.sessionStorage.setItem('SystemFilter', JSON.stringify(this.filter))

    this.dataSource.load(this.filter)
  }

  openDialog(s: System | undefined = undefined): void {

    const dialogRef = this.dialog.open(SystemDialogComponent, {
      disableClose: true,
      width: '500px',
      data: s
    })

    dialogRef.afterClosed().pipe(first()).subscribe((result) => {
      if (!!result) {
        this.loadData()
      }
    })

  }

  deleteDialog(s: System): void {

    const dialogRef = this.dialog.open(SystemDeleteDialogComponent, {
      width: '500px',
      data: s
    });

    dialogRef.afterClosed().pipe(first()).subscribe((result) => {
      if (!!result) {
        this.systemService.delete(s).subscribe({
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

  restore(s: System): void {
    this.systemService.restore(s).pipe(first()).subscribe({
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

  onMouseEvent(s: System | undefined = undefined): void {
    this.currentRow = s
  }

}
