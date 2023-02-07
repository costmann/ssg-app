import { AttributeValue, IssueAttribute } from './../models/issue-attribute';

import { ArrayResultService } from '../datasources/array.datasource';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Item } from '../models/item';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IssueAttributeService implements ArrayResultService<IssueAttribute> {

  constructor(private http: HttpClient) { }

  load(filter: number): Observable<IssueAttribute[]> {
    return this.getAttributes(filter)
  }

  resetAttributes(id: number, renew = true): Observable<any> {
    return this.http.put<any>(`${environment.apiUrl}/Issues/ResetAttributes/${id}?renew=${renew}`, null)
  }

  getAttributes(id: number): Observable<IssueAttribute[]> {
    return this.http.get<IssueAttribute[]>(`${environment.apiUrl}/Issues/Attributes/${id}`)
  }

  updateAttribute(data: AttributeValue): Observable<any> {
    console.dir(data)
    return this.http.put(`${environment.apiUrl}/Issues/Attribute/${data.id}`, data)
  }

  getItems(name: string): Observable<Item[]> {
    return this.http.get<Item[]>(`${environment.apiUrl}/Attributes/Table/${name}`)
  }
}
