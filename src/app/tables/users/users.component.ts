import { AppRole, AppUser } from 'src/app/models/app-user';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { Subscription, debounceTime, distinctUntilChanged, first, fromEvent, tap } from 'rxjs';

import { AppUserService } from 'src/app/services/app-user.service';
import { ArrayDataSource } from 'src/app/datasources/array.datasource';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { UserDialogComponent } from './user-dialog/user-dialog.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  displayedColumns = [
    "userName",
    "surname",
    "name",
    "email",
    "phone",
    "roles",
    "actions",
  ]

  fields = [
    {name:'surname', description:'Surname'},
    {name:'userName', description:'Serial'},
  ]

  dataSource: ArrayDataSource<AppUser>

  filter = ''

  keyupSubscription : Subscription | undefined

  @ViewChild('search') input!: ElementRef

  currentRow: AppUser | undefined

  constructor(
    public dialog: MatDialog,
    userService: AppUserService,
    private translateService: TranslateService)
  {
    this.dataSource = new ArrayDataSource(userService)

    const value = window.sessionStorage.getItem('OperatorFilter')
    if (!!value) {
      this.filter = value
    }
  }

  ngOnInit(): void {
    this.loadData()
  }

  ngAfterViewInit(): void {


    this.keyupSubscription = fromEvent(this.input.nativeElement, 'keyup')
      .pipe(
          debounceTime(150),
          distinctUntilChanged(),
          tap(() => {
              this.loadData()
          })
      )
      .subscribe()
  }

  ngOnDestroy(): void {
    this.keyupSubscription?.unsubscribe()
  }

  loadData(): void {
    window.sessionStorage.setItem('OperatorFilter', this.filter)
    this.dataSource.load(this.filter)
  }

  clearSearch(): void {
    this.filter = ''
    this.loadData()
  }

  openDialog(user: AppUser | undefined = undefined): void {

    const dialogRef = this.dialog.open(UserDialogComponent, {
      disableClose: true,
      width: '500px',
      data: user
    })

    dialogRef.afterClosed().pipe(first()).subscribe((result) => {
      if (!!result) {
        this.loadData()
      }
    })
  }

  getRoles(roles: AppRole[]): string {
    return roles.map(r => this.translateService.instant('Role_'+ r.name)).join(', ')
  }

  onMouseEvent(u: AppUser | undefined = undefined): void {
    this.currentRow = u
  }

}
