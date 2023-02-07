import { ApiResult, ApiResultService } from '../datasources/api-result.datasource';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Equipment } from '../models/equipment';
import { Filter } from '../models/filter';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EquipmentService implements ApiResultService<Equipment>  {

  constructor(private http: HttpClient) { }

  load(filter: Filter): Observable<ApiResult<Equipment>> {

    let params = new HttpParams()
      .set('pageIndex', filter.pageIndex)
      .set('pageSize', filter.pageSize)
      .set('sortColumn', filter.sortColumn)
      .set('sortOrder', filter.sortDirection)
      .set('filterColumn', filter.filterColumn)
      .set('filterQuery', filter.filterQuery)

    return this.http.get<ApiResult<Equipment>>(`${environment.apiUrl}/Equipments`, { params })

  }

  put(data: Equipment): Observable<any> {
    return this.http.put(`${environment.apiUrl}/Equipments/${data.id}`, data)
  }

  post(data: Equipment): Observable<any> {
    return this.http.post(`${environment.apiUrl}/Equipments`, data)
  }

  delete(data: Equipment): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/Equipments/${data.id}`)
  }

  restore(data: Equipment): Observable<any> {
    return this.http.put(`${environment.apiUrl}/Equipments/Restore/${data.id}`, null)
  }

  filterEquipments(queryString: string): Observable<Equipment[]> {
    let params = new HttpParams()
    if (!!queryString) {
      params = params.append('queryString', queryString)
    }
    return this.http.get<Equipment[]>(`${environment.apiUrl}/Equipments/Filter`, { params })
  }

}
