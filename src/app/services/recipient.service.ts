import { ApiResult, ApiResultService } from '../datasources/api-result.datasource';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Filter } from '../models/filter';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Person } from '../models/person';
import { Recipient } from './../models/recipient';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RecipientService implements ApiResultService<Recipient> {

  constructor(private http: HttpClient) { }

  load(filter: Filter): Observable<ApiResult<Recipient>> {

    let params = new HttpParams()
      .set('pageIndex', filter.pageIndex)
      .set('pageSize', filter.pageSize)
      .set('sortColumn', filter.sortColumn)
      .set('sortOrder', filter.sortDirection)
      .set('filterColumn', filter.filterColumn)
      .set('filterQuery', filter.filterQuery)

    return this.http.get<ApiResult<Recipient>>(`${environment.apiUrl}/Recipients`, { params })

  }

  put(data: Recipient): Observable<any> {
    return this.http.put(`${environment.apiUrl}/Recipients/${data.id}`, data)
  }

  post(data: Recipient): Observable<any> {
    return this.http.post(`${environment.apiUrl}/Recipients`, data)
  }

  delete(data: Recipient): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/Recipients/${data.id}`)
  }

  restore(data: Recipient): Observable<any> {
    return this.http.put(`${environment.apiUrl}/Recipients/Restore/${data.id}`, null)
  }

  filterResources(queryString: string): Observable<Person[]> {

    let params = new HttpParams()
    if (!!queryString) {
      params = params.append('queryString', queryString)
    }

    return this.http.get<Person[]>(`${environment.apiUrl}/Recipients/Filter`, { params })
  }
}
