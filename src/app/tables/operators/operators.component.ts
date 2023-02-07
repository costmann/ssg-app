import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription, debounceTime, distinctUntilChanged, fromEvent, tap } from 'rxjs';

import { AppUser } from './../../models/app-user';
import { ArrayDataSource } from 'src/app/datasources/array.datasource';
import { CandidatesService } from 'src/app/services/candidates.service';

@Component({
  selector: 'app-operators',
  templateUrl: './operators.component.html',
  styleUrls: ['./operators.component.scss']
})
export class OperatorsComponent implements OnInit, AfterViewInit, OnDestroy {

  displayedColumns = [
    "userName",
    "surname",
    "name",
    "email",
    "phone",
  ]

  fields = [
    {name:'surname', description:'Surname'},
    {name:'userName', description:'Serial'},
  ]

  dataSource: ArrayDataSource<AppUser>

  filter = ''

  keyupSubscription : Subscription | undefined

  @ViewChild('search') input!: ElementRef

  constructor(private userService: CandidatesService,) {
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

}
