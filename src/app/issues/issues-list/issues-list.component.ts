import { AfterViewInit, Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Observable, Subscription, debounceTime, distinctUntilChanged, first, fromEvent, merge, tap } from 'rxjs';
import { animate, state, style, transition, trigger } from '@angular/animations';

import { ApiResultDataSource } from 'src/app/datasources/api-result.datasource';
import { AppUserService } from 'src/app/services/app-user.service';
import { CreateIssueDialogComponent } from '../create-issue-dialog/create-issue-dialog.component';
import { Email } from 'src/app/models/email';
import { EmailService } from './../../services/email.service';
import { Issue } from 'src/app/models/issue';
import { IssueFilter } from 'src/app/models/filter';
import { IssueService } from 'src/app/services/issue.service';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSelectChange } from '@angular/material/select';
import { MatSort } from '@angular/material/sort';
import { State } from 'src/app/models/state';

@Component({
  selector: 'app-issues-list',
  templateUrl: './issues-list.component.html',
  styleUrls: ['./issues-list.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class IssuesListComponent implements OnInit, AfterViewInit, OnDestroy  {

  displayedColumns = ["code", "area", "plant", "issuedAt", "lastUpdatedAt", "issuedBy", "state", "action"]

  fields = [
    {name:'code', description:'Code'},
    {name:'description', description:'Description'},
    {name:'responsibleUser', description:'Responsible'},
    {name:'delegateUser', description:'Delegate'},
    {name:'RecipientUser', description:'Recipient'},
    {name:'issuedBy', description:'Author'},
    {name:'areaDescription', description:'Area'},
    {name:'plantDescription', description:'Plant'},
    {name:'equipmentDescription', description:'Equipment'},
  ]

  dataSource: ApiResultDataSource<Issue>

  filter: IssueFilter

  @ViewChild(MatPaginator) paginator!: MatPaginator
  @ViewChild(MatSort) sort!: MatSort

  tableSubscription : Subscription | undefined
  keyupSubscription : Subscription | undefined

  @ViewChild('search') input!: ElementRef

  currentRow: Issue | undefined

  states$: Observable<State[]>

  @Output() openIssue = new EventEmitter<Issue>()

  expandedElement: string | null

  constructor(
    private issueService: IssueService,
    public dialog: MatDialog,
    private emailService: EmailService,
    private user: AppUserService)
  {
    this.dataSource = new ApiResultDataSource(issueService)

    const json = window.sessionStorage.getItem('IssueFilter')
    if (!!json) {
      this.filter = JSON.parse(json)
    } else {
      this.filter = new IssueFilter()
      this.filter.sortColumn = 'code'
      this.filter.filterColumn = 'code'
      this.filter.filterStates = ['I', 'O' , 'S']
    }

    this.states$ = issueService.getStates()

    this.expandedElement = window.sessionStorage.getItem('expandedIssue')

  }

  loadData(): void {

    this.filter.pageIndex =  !!this.paginator ? this.paginator.pageIndex : this.filter.pageIndex
    this.filter.pageSize =  !!this.paginator ? this.paginator.pageSize : this.filter.pageSize
    this.filter.sortColumn =  !!this.sort ? this.sort.active : this.filter.sortColumn
    this.filter.sortDirection =  !!this.sort ? this.sort.direction : this.filter.sortDirection

    window.sessionStorage.setItem('IssueFilter', JSON.stringify(this.filter))

    this.dataSource.load(this.filter)
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

  createIssue(): void {
    const dialogRef = this.dialog.open(CreateIssueDialogComponent, {
      width: '600px',
      panelClass: 'custom-dialog-container',
      disableClose: true,
    })

    dialogRef.afterClosed().pipe(first()).subscribe((issue: Issue) => {
      if (!!issue) {

        this.createEmailNewIssue(issue).then(email => {
          if (!!email) {
            this.emailService.send(email)
          }
        })

        this.loadData()
        this.openIssue.emit(issue)
      }
    })
  }

  deleteDialog(issue: Issue): void {
  }

  restore(issue: Issue): void {
  }

  clearSearch(): void {
    this.filter.filterQuery = ''
    this.loadData()
  }

  onMouseEvent(issue: Issue | undefined = undefined): void {
    this.currentRow = issue
  }

  applyFilterState(event: MatSelectChange): void {
    console.dir(event)
    // const values = event.target.value
    this.filter.filterStates = event.value // values.split(",").filter((x: any) => x.trim().length && !isNaN(x)).map(Number)
    this.loadData()
  }

  expand(element: Issue): void {
    this.expandedElement = this.expandedElement === element.code ? null : element.code

    if (!!this.expandedElement) {
      window.sessionStorage.setItem('expandedIssue', this.expandedElement)
    } else {
      window.sessionStorage.removeItem('expandedIssue')
    }
  }

  isExpanded(element: Issue): boolean {
    return this.expandedElement === element.code
  }

  async createEmailNewIssue(issue: Issue): Promise<Email | null> {

    var from = ''
    var to: string[] = []
    var cc: string[] = []
    var message: string[] = []

    const delegate = await this.user.getUserAsync(issue.delegateUser)
    if (!!delegate && !!delegate.email) {
      to.push(delegate.email)
    }

    const responsible = await this.user.getUserAsync(issue.responsibleUser)
    if (!!responsible && !!responsible.email) {
      if (to.length === 0) {
        to.push(responsible.email)
      } else {
        cc.push(responsible.email)
      }
    }

    if (to.length === 0) {
      return null
    }

    const issuer = await this.user.getUserAsync(issue.issuedBy)
    if (!issuer) {
      return null
    }
    if (!!issuer.email) {
      from = issuer.email
    }



    const subject = `Richiesta di attività. Emissione ticket n° ${issue.code}`

    message.push(`L'utente ${issuer.name} ${issuer.surname} ha creato il ticket n° ${issue.code}\n\n`)
    message.push(`Descrizione del problema:\n${issue.description}\n\n`)

    message.push(`Area tematica: ${issue.areaDescription}\n`)
    if (!!responsible) {
      message.push(`Responsabile: ${responsible.displayName}\n`)
    }

    if (!!issue.plantDescription) {
      message.push(`Impianto: ${issue.plantDescription}\n`)
    }

    if (!!delegate) {
      message.push(`Delagato: ${delegate.displayName}\n`)
    }

    const step = await this.issueService.getLastStepAsync(issue.id)
    if (!!step && !!step.notes ) {
      message.push(`\n`)
      message.push(`Note:\n\n`)
      message.push(step.notes)
    }

    return {from, to, cc, subject, message: message.join('')}
  }

}
