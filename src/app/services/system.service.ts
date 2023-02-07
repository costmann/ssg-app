import { ApiResult, ApiResultService } from '../datasources/api-result.datasource';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Filter } from '../models/filter';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { System } from '../models/system';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SystemService implements ApiResultService<System> {

  constructor(private http: HttpClient) { }

  load(filter: Filter): Observable<ApiResult<System>> {

    let params = new HttpParams()
      .set('pageIndex', filter.pageIndex)
      .set('pageSize', filter.pageSize)
      .set('sortColumn', filter.sortColumn)
      .set('sortOrder', filter.sortDirection)
      .set('filterColumn', filter.filterColumn)
      .set('filterQuery', filter.filterQuery)

    return this.http.get<ApiResult<System>>(`${environment.apiUrl}/Systems`, { params })
  }

  put(data: System): Observable<any> {
    return this.http.put(`${environment.apiUrl}/Systems/${data.id}`, data)
  }

  post(data: System): Observable<any> {
    return this.http.post(`${environment.apiUrl}/Systems`, data)
  }

  delete(data: System): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/Systems/${data.id}`)
  }

  restore(data: System): Observable<any> {
    return this.http.put(`${environment.apiUrl}/Systems/Restore/${data.id}`, null)
  }

  getCurrentSystems(): Observable<System[]> {
    return this.http.get<System[]>(`${environment.apiUrl}/Systems/All?includeDeleted=false`)
  }
}
