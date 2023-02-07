import { Attribute, SaveAttribute } from '../models/attribute';

import { DataType } from '../models/data-type';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AttributeService {

  constructor(private http: HttpClient) { }

  getAttributes(areaId: number): Observable<Attribute[]> {
    return this.http.get<Attribute[]>(`${environment.apiUrl}/Attributes/Area/${areaId}`)
  }

  addAttribute(data: SaveAttribute): Observable<Attribute> {
    return this.http.post<Attribute>(`${environment.apiUrl}/Attributes`, data)
  }

  updateAttribute(data: SaveAttribute):  Observable<any> {
    return this.http.put(`${environment.apiUrl}/Attributes/${data.id}`, data)
  }

  deleteAttribute(id: number): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/Attributes/${id}`)
  }

  getDataTypes(): Observable<DataType[]> {
    return this.http.get<DataType[]>(`${environment.apiUrl}/Attributes/DataTypes`)
  }
}
