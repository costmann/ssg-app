import { ApiResult, ApiResultService } from '../datasources/api-result.datasource';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Filter } from '../models/filter';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Plant } from '../models/plant';
import { Site } from '../models/site';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PlantService implements ApiResultService<Plant>  {

  constructor(private http: HttpClient) { }

  load(filter: Filter): Observable<ApiResult<Plant>> {

    let params = new HttpParams()
      .set('pageIndex', filter.pageIndex)
      .set('pageSize', filter.pageSize)
      .set('sortColumn', filter.sortColumn)
      .set('sortOrder', filter.sortDirection)
      .set('filterColumn', filter.filterColumn)
      .set('filterQuery', filter.filterQuery)

    return this.http.get<ApiResult<Plant>>(`${environment.apiUrl}/Plants`, { params })

  }

  put(data: Plant): Observable<any> {
    return this.http.put(`${environment.apiUrl}/Plants/${data.id}`, data)
  }

  post(data: Plant): Observable<any> {
    return this.http.post(`${environment.apiUrl}/Plants`, data)
  }

  delete(data: Plant): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/Plants/${data.id}`)
  }

  restore(data: Plant): Observable<any> {
    return this.http.put(`${environment.apiUrl}/Plants/Restore/${data.id}`, null)
  }

  getSites(): Observable<Site[]> {
    return this.http.get<Site[]>(`${environment.apiUrl}/Sites`)
  }

  filterPlants(queryString: string): Observable<Plant[]> {
    let params = new HttpParams()
    if (!!queryString) {
      params = params.append('queryString', queryString)
    }
    return this.http.get<Plant[]>(`${environment.apiUrl}/Plants/Filter`, { params })
  }

}
