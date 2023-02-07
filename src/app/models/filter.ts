import { SortDirection } from "@angular/material/sort";

export class Filter {
  constructor(
    public pageIndex = 0,
    public pageSize = 20,
    public sortColumn = '',
    public sortDirection: SortDirection = 'asc',
    public filterColumn = '',
    public filterQuery = '') { }
}

export class IssueFilter extends Filter {
  filterStates: string[] = []
}

export class OnCallFilter {
  year: number
  week: number
  area: number | undefined

  constructor() {
    const date = new Date()

    this.year = date.getFullYear()

    date.setHours(0, 0, 0, 0)
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7)
    var week1 = new Date(date.getFullYear(), 0, 4)
    this.week =  1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7)
  }
}
