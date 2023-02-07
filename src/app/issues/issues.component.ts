import { Component, OnInit } from '@angular/core';

import { Issue } from '../models/issue';

@Component({
  selector: 'app-issues',
  templateUrl: './issues.component.html',
  styleUrls: ['./issues.component.scss']
})
export class IssuesComponent implements OnInit {

  currentIssue: Issue | undefined

  constructor() {
    this.currentIssue = this.getCurrentIssue()
  }

  ngOnInit(): void {
  }

  getCurrentIssue(): Issue | undefined {
    const json = window.sessionStorage.getItem('currentIssue')
    if (!!json) {
      return JSON.parse(json) as Issue
    }
    return undefined
  }

  openIssue(issue: Issue): void {
    window.sessionStorage.setItem('currentIssue', JSON.stringify(issue))
    this.currentIssue = issue
  }

  closeIssue(): void {
    window.sessionStorage.removeItem('currentIssue')
    this.currentIssue = undefined
  }
}
