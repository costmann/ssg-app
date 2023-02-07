import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable, first, map } from 'rxjs';

import { AppUserService } from 'src/app/services/app-user.service';
import { AssignDialogComponent } from '../commands/assign-dialog/assign-dialog.component';
import { AuthService } from './../../services/auth.service';
import { Command } from 'src/app/models/command';
import { DefaultDialogComponent } from './../commands/default-dialog/default-dialog.component';
import { Email } from 'src/app/models/email';
import { EmailService } from './../../services/email.service';
import { Issue } from './../../models/issue';
import { IssueService } from 'src/app/services/issue.service';
import { MatDialog } from '@angular/material/dialog';
import { OpenDialogComponent } from './../commands/open-dialog/open-dialog.component';

@Component({
  selector: 'app-issue',
  templateUrl: './issue.component.html',
  styleUrls: ['./issue.component.scss']
})
export class IssueComponent implements OnInit {

  @Output() closeIssue = new EventEmitter<Issue>()

  issue$: Observable<Issue> | undefined
  commands$: Observable<Command[]> | undefined

  constructor(
    private issueService: IssueService,
    public dialog: MatDialog,
    private authService: AuthService,
    private emailService: EmailService,
    private user: AppUserService,
  ) {

  }

  @Input()
  set id(value: number) {
    this._id = value
    this.reload()
  }
  private _id = 0

  ngOnInit(): void {
  }

  mailTo(email: string): void {
    window.location.href = `mailto:${email}`
  }

  reload(): void{
    this.issue$ = this.issueService.get(this._id)
    // this.commands$ = this.issueService.getCommands(this._id)

    this.commands$ = this.issueService.getCommands(this._id).pipe(
      map(commands => commands.filter(c => this.authService.isInRole(c.roles)))
    )

  }

  exec(c: Command, i: Issue): void {
    switch (c.commandName) {
      case 'OpenCommand':
        this.openCommand(c, i)
        break;

      case 'AssignCommand':
      case 'ReopenCommand':
        this.assignCommand(c, i)
        break;

      default:
        this.defaultCommand(c, i)
        break;
    }
  }

  defaultCommand(c: Command, i: Issue): void {

    const dialogRef = this.dialog.open(DefaultDialogComponent, {
      disableClose: true,
      width: '500px',
      data: {
        issue: i,
        command: c
      },
      panelClass: 'custom-dialog-container',
    })

    dialogRef.afterClosed().pipe(first()).subscribe((issue: Issue) => {
      if (!!issue) {
        this.reload()
      }
    })

  }

  openCommand(c: Command, i: Issue): void {

    const b = this.authService.isInRole(['61','62'])
    console.log(b)

    const dialogRef = this.dialog.open(OpenDialogComponent, {
      disableClose: true,
      width: '500px',
      data: {
        issue: i,
        command: c
      },
      panelClass: 'custom-dialog-container',
    })

    dialogRef.afterClosed().pipe(first()).subscribe((issue: Issue) => {
      if (!!issue) {
        this.createEmail(issue, true).then(email => {
          if (!!email) {
            this.emailService.send(email)
          }
        })
        this.reload()
      }
    })

  }

  assignCommand(c: Command, i: Issue): void {

    const dialogRef = this.dialog.open(AssignDialogComponent, {
      disableClose: true,
      width: '500px',
      data: {
        issue: i,
        command: c
      },
      panelClass: 'custom-dialog-container',
    })

    dialogRef.afterClosed().pipe(first()).subscribe((issue: Issue) => {
      if (!!issue) {
        this.createEmail(issue).then(email => {
          if (!!email) {
            this.emailService.send(email)
          }
        })
        this.reload()
      }
    })

  }

  async createEmail(issue: Issue, opening: boolean = false): Promise<Email | null> {

    console.dir(issue)

    if (!this.authService.userValue) {
      return null
    }

    if (!issue.recipientUser) {
      return null
    }

    const sender = await this.user.getUserAsync(this.authService.userValue.name)
    if (!sender) {
      return null
    }

    const recipient = await this.user.getUserAsync(issue.recipientUser)
    if (!recipient) {
      return null
    }

    const responsible = await this.user.getUserAsync(issue.responsibleUser)

    var from = sender.email
    var to: string[] = [recipient.email]
    var cc: string[] = []
    var subject = ''
    var message: string[] = []

    if (opening) {
      subject = `Richiesta di attività: Apertura ticket n° ${issue.code}`
    } else {
      subject = `Richiesta di attività: Assegnazione ticket n° ${issue.code}`
    }

    message.push(`Buongiorno ${recipient.name} ${recipient.surname},\n\n`)

    if (sender.userName != recipient.userName) {
      message.push(`L'utente ${sender.name} ${sender.surname} ti ha assegnato il ticket n° ${issue.code}\n\n`)
    } else {
      message.push(`Sei stato assegnato al ticket n° ${issue.code}\n\n`)
    }

    message.push(`Descrizione del problema:\n${issue.description}\n\n`)

    message.push(`Area tematica: ${issue.areaDescription}\n`)

    if (!!responsible) {
      message.push(`Responsabile: ${responsible.displayName}\n`)
    }

    if (!!issue.plantDescription) {
      message.push(`Impianto: ${issue.plantDescription}\n`)
    }

    const issueAttributes = await this.issueService.getAttributesAsync(issue.id)
    console.table(issueAttributes)
    if (!!issueAttributes && issueAttributes.length > 0) {
      issueAttributes.forEach(a => {
        if (!!a.assetName) {
          message.push(`${a.name}: ${a.assetName}\n`)
        } else {
          if (!!a.value) {
            message.push(`${a.name}: ${a.value}\n`)
          }
        }
      })
    }

    const step = await this.issueService.getLastStepAsync(issue.id)
    if (!!step && !!step.notes ) {
      message.push(`\n`)
      message.push(`Note:\n${step.notes}\n`)
    }

    if (!!responsible && !!responsible.email) {
      cc.push(responsible.email)
    }

    return {from, to, cc, subject, message: message.join('')}
  }

  getIcon(commandName: string): string {
    switch (commandName) {

      case 'OpenCommand':
        return 'start'

      case 'AssignCommand':
        return 'person'

      case 'CloseCommand':
          return 'stop'

      case 'ReopenCommand':
        return 'restart_alt'

      case 'SuspendCommand':
        return 'pause'

      default:
        return 'bolt'
    }
  }

}
