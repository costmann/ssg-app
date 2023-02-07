import { ApiResult, ApiResultService } from '../datasources/api-result.datasource';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Company } from '../models/company';
import { Filter } from '../models/filter';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CompanyService implements ApiResultService<Company>  {

  constructor(private http: HttpClient) { }

  load(filter: Filter): Observable<ApiResult<Company>> {

    let params = new HttpParams()
      .set('pageIndex', filter.pageIndex)
      .set('pageSize', filter.pageSize)
      .set('sortColumn', filter.sortColumn)
      .set('sortOrder', filter.sortDirection)
      .set('filterColumn', filter.filterColumn)
      .set('filterQuery', filter.filterQuery)

    return this.http.get<ApiResult<Company>>(`${environment.apiUrl}/Companies`, { params })

  }

  put(data: Company): Observable<any> {
    return this.http.put(`${environment.apiUrl}/Companies/${data.id}`, data)
  }

  post(data: Company): Observable<any> {
    return this.http.post(`${environment.apiUrl}/Companies`, data)
  }

  delete(data: Company): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/Companies/${data.id}`)
  }

  restore(data: Company): Observable<any> {
    return this.http.put(`${environment.apiUrl}/Companies/Restore/${data.id}`, null)
  }


  getCompanies(includeDeleted = false): Observable<Company[]> {
    return this.http.get<Company[]>(`${environment.apiUrl}/Companies/All?includeDeleted=${includeDeleted}`)
  }
}
