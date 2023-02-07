import { ArrayResultService } from '../datasources/array.datasource';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Step } from '../models/step';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StepService implements ArrayResultService<Step> {

  constructor(private http: HttpClient) { }

  load(filter: number): Observable<Step[]> {
    return this.http.get<Step[]>(`${environment.apiUrl}/Issues/Steps/${filter}`)
  }

  updateNote(data: any): Observable<any> {
    return this.http.put(`${environment.apiUrl}/Issues/StepNote/${data.id}`, {
      id: data.id,
      notes: data.notes
    })
  }
}
