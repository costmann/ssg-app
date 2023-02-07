import { HttpClient, HttpParams } from '@angular/common/http';

import { Area } from '../models/area';
import { ArrayResultService } from '../datasources/array.datasource';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OnCall } from '../models/oncall';
import { OnCallFilter } from 'src/app/models/filter';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OnCallService implements ArrayResultService<OnCall> {

  constructor(private http: HttpClient) { }

  load(filter: OnCallFilter): Observable<OnCall[]> {

    let params = new HttpParams()
      .set('year', filter.year)
      .set('week', filter.week)

    if (!!filter.area) {
      params = params.set('areaId', filter.area)
    }

    console.dir(params)

    return this.http.get<OnCall[]>(`${environment.apiUrl}/OnCalls`, { params })
  }

  getOnCallAreas(): Observable<Area[]> {
    return this.http.get<Area[]>(`${environment.apiUrl}/Areas/OnCall`)
  }

  post(data: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/OnCalls`, data)
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/OnCalls/${id}`)
  }
}
