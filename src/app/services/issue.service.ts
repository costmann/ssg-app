import { ApiResult, ApiResultService } from '../datasources/api-result.datasource';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, firstValueFrom, map, of } from 'rxjs';

import { Command } from '../models/command';
import { Injectable } from '@angular/core';
import { Issue } from './../models/issue';
import { IssueAttribute } from 'src/app/models/issue-attribute';
import { IssueFilter } from './../models/filter';
import { State } from '../models/state';
import { Step } from '../models/step';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IssueService implements ApiResultService<Issue> {

  constructor(private http: HttpClient) { }

  load(filter: IssueFilter): Observable<ApiResult<Issue>> {

    let params = new HttpParams()
      .set('pageIndex', filter.pageIndex)
      .set('pageSize', filter.pageSize)
      .set('sortColumn', filter.sortColumn)
      .set('sortOrder', filter.sortDirection)
      .set('filterColumn', filter.filterColumn)
      .set('filterQuery', filter.filterQuery)
      .set('filterStates', filter.filterStates.join(','))

    return this.http.get<ApiResult<Issue>>(`${environment.apiUrl}/Issues`, { params })
  }

  get(id: number): Observable<Issue> {
    return this.http.get<Issue>(`${environment.apiUrl}/Issues/${id}`)
  }

  post(data: any): Observable<Issue> {
    const send = {
      issuedBy: !!data.recipient ? data.recipient.userName : null,
      areaId: data.area.id,
      plantId: !!data.plant ? data.plant.id : null,
      description: data.description,
      notes: data.notes,
    }
    return this.http.post<Issue>(`${environment.apiUrl}/Issues`, send)
  }

  put(data: any): Observable<any> {
    return this.http.put(`${environment.apiUrl}/Issues/${data.id}`, {
      description: data.description
    })
  }

  // exec(cmd: any): Observable<any> {
  //   return this.http.put(`${environment.apiUrl}/Issues/ExecuteCommand/${cmd.id}`, cmd)
  // }
  exec(cmd: any): Observable<Issue> {
    return this.http.post<Issue>(`${environment.apiUrl}/Issues/ExecuteCommand`, cmd)
  }

  delete(data: Issue): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/Issues/${data.id}`)
  }

  getStates(): Observable<State[]> {
    return this.http.get<State[]>(`${environment.apiUrl}/Issues/States`)
  }

  getCommands(id: number): Observable<Command[]> {
    return this.http.get<Command[]>(`${environment.apiUrl}/Issues/Commands/${id}`)
  }

  async getLastStepAsync(id: number): Promise<Step | null> {
    return await firstValueFrom(
      this.http.get<Step>(`${environment.apiUrl}/Issues/LastStep/${id}`).pipe(
        map(step => step),
        catchError(() => of(null))
      )
    )
  }

  // async getAssetsAsync(id: number): Promise<Asset[] | null> {
  //   return await firstValueFrom(
  //     this.http.get<Asset[]>(`${environment.apiUrl}/Issues/Assets/${id}`).pipe(
  //       map(assets => assets),
  //       catchError(() => of(null))
  //     )
  //   )
  // }

  async getAttributesAsync(id: number): Promise<IssueAttribute[] | null> {
    return await firstValueFrom(
      this.http.get<IssueAttribute[]>(`${environment.apiUrl}/Issues/Attributes/${id}`).pipe(
        map(assets => assets),
        catchError(() => of(null))
      )
    )
  }
}
