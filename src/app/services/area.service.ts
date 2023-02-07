import { ApiResult, ApiResultService } from '../datasources/api-result.datasource';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Area } from '../models/area';
import { Filter } from '../models/filter';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AreaService implements ApiResultService<Area> {

  constructor(private http: HttpClient) { }

  load(filter: Filter): Observable<ApiResult<Area>> {

    let params = new HttpParams()
      .set('pageIndex', filter.pageIndex)
      .set('pageSize', filter.pageSize)
      .set('sortColumn', filter.sortColumn)
      .set('sortOrder', filter.sortDirection)
      .set('filterColumn', filter.filterColumn)
      .set('filterQuery', filter.filterQuery)

    return this.http.get<ApiResult<Area>>(`${environment.apiUrl}/Areas`, { params })
  }

  put(id: number, data: any): Observable<any> {
    console.dir(data)
    if (data["delegate"] === '') {
      data["delegate"] = null
    }
    return this.http.put(`${environment.apiUrl}/Areas/${id}`, data)
  }

  post(data: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/Areas`, data)
  }

  delete(data: Area): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/Areas/${data.id}`)
  }

  restore(data: Area): Observable<any> {
    return this.http.put(`${environment.apiUrl}/Areas/Restore/${data.id}`, null)
  }

  getCurrentAreas(): Observable<Area[]> {
    return this.http.get<Area[]>(`${environment.apiUrl}/Areas/All?includeDeleted=false`)
  }

}
