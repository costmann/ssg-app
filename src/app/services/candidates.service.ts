import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ArrayResultService } from '../datasources/array.datasource';
import { AppUser } from '../models/app-user';

@Injectable({
  providedIn: 'root'
})
export class CandidatesService implements ArrayResultService<AppUser>  {

  constructor(private http: HttpClient) { }

  load(filter: any): Observable<AppUser[]> {
    return this.http.post<any[]>(`${environment.authUrl}/user/findAllDomain/${environment.domain}`, {userName: `${environment.domain}\\`}).pipe(
      map(r => {
        return r.filter(o => this.filter(o, filter.toLowerCase()))
          .map(o => <AppUser>{
            userName: o.userName.toLowerCase(),
            surname: o.surname.charAt(0).toUpperCase() + o.surname.slice(1).toLowerCase(),
            name: o.name.charAt(0).toUpperCase() + o.name.slice(1).toLowerCase(),
            displayName: `${o.surname.charAt(0).toUpperCase() + o.surname.slice(1).toLowerCase()} ${o.name.charAt(0).toUpperCase() + o.name.slice(1).toLowerCase()}`,
            email: o.email.toLowerCase(),
            telephoneNumber: o.telephoneNumber
          })
          .sort((a,b) => (a.displayName > b.displayName) ? 1 : ((b.displayName > a.displayName) ? -1 : 0))
      })
    )
  }

  private filter(o: AppUser, value: string): boolean {
    return o.name.toLowerCase().startsWith(value)
      || o.surname.toLowerCase().startsWith(value)
      || o.userName.toLowerCase().startsWith(`${environment.domain}\\${value}`)
  }
}
