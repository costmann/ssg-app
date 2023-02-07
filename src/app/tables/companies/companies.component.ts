import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription, debounceTime, distinctUntilChanged, first, fromEvent, merge, tap } from 'rxjs';

import { ApiResultDataSource } from 'src/app/datasources/api-result.datasource';
import { Company } from 'src/app/models/company';
import { CompanyDeleteDialogComponent } from './company-delete-dialog/company-delete-dialog.component';
import { CompanyDialogComponent } from './company-dialog/company-dialog.component';
import { CompanyService } from 'src/app/services/company.service';
import { Filter } from 'src/app/models/filter';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.scss']
})
export class CompaniesComponent implements OnInit, AfterViewInit, OnDestroy {

  displayedColumns = ["businessName", "recipients", "actions"]

  dataSource: ApiResultDataSource<Company>

  filter: Filter

  @ViewChild(MatPaginator) paginator!: MatPaginator
  @ViewChild(MatSort) sort!: MatSort

  tableSubscription : Subscription | undefined
  keyupSubscription : Subscription | undefined

  @ViewChild('search') input!: ElementRef

  currentRow: Company | undefined

  constructor(private companyService: CompanyService, public dialog: MatDialog) {
    this.dataSource = new ApiResultDataSource(companyService)


    const json = window.sessionStorage.getItem('CompanyFilter')
    if (!!json) {
      this.filter = JSON.parse(json)
    } else {
      this.filter = new Filter()
      this.filter.sortColumn = 'businessName'
      this.filter.filterColumn = 'businessName'
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

    window.sessionStorage.setItem('CompanyFilter', JSON.stringify(this.filter))

    this.dataSource.load(this.filter)
  }

  openDialog(c: Company | undefined = undefined): void {

    const dialogRef = this.dialog.open(CompanyDialogComponent, {
      disableClose: true,
      width: '500px',
      data: c
    })

    dialogRef.afterClosed().pipe(first()).subscribe((result) => {
      if (!!result) {
        this.loadData()
      }
    })

  }

  deleteDialog(c: Company): void {

    const dialogRef = this.dialog.open(CompanyDeleteDialogComponent, {
      width: '500px',
      data: c
    });

    dialogRef.afterClosed().pipe(first()).subscribe((result) => {
      if (!!result) {
        this.companyService.delete(c).subscribe({
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

  restore(c: Company): void {
    this.companyService.restore(c).pipe(first()).subscribe({
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

  onMouseEvent(c: Company | undefined = undefined): void {
    this.currentRow = c
  }

}
