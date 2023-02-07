import { AppRole, AppUser } from './../models/app-user';
import { Injectable } from '@angular/core';
import { ArrayResultService } from '../datasources/array.datasource';
import { catchError, firstValueFrom, forkJoin, map, Observable, of, switchMap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AppUserService implements ArrayResultService<AppUser>   {

  constructor(private http: HttpClient) { }

  load(filter: string): Observable<AppUser[]> {
    return this.getRoles().pipe(map(roles => roles.map(r => r.id))).pipe(
      switchMap(r => forkJoin({result: this.getUsers(filter, r)}).pipe(
        map(r => r.result))
      )
    )
  }

  // getRoles(): Observable<AppRole[]> {
  //   return this.http.get<any[]>(`${environment.authUrl}/appRole/findAllByAppName?appName=${environment.appName}`).pipe(
  //     map((roles: any[]) => {
  //       return roles.map((r: { roleId: number, roleCd: string }) => <AppRole>{
  //         id: r.roleId,
  //         name: r.roleCd
  //       }).sort((a,b) => (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0))
  //     })
  //   )
  // }

  getRoles(except: number[] = []): Observable<AppRole[]> {
    return this.http.get<any[]>(`${environment.authUrl}/appRole/findAllByAppName?appName=${environment.appName}`).pipe(
      map((roles: any[]) => {
        return roles.filter(r => except.indexOf(r.roleId) === -1).map((r: { roleId: number, roleCd: string }) => <AppRole>{
          id: r.roleId,
          name: r.roleCd
        }).sort((a,b) => (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0))
      })
    )
  }

  getUser(username: string): Observable<AppUser> {
    return this.http.get(`${environment.authUrl}/user/findOneUser?userName=${encodeURIComponent(username)}`).pipe(
      map(user  => {return this.mapUser(user)})
    )
  }

  getUser$(username: string): Observable<AppUser | null> {
    return this.http.get(`${environment.authUrl}/user/findOneUser?userName=${encodeURIComponent(username)}`).pipe(
      map(user  => {return this.mapUser(user)}),
      catchError( () => {
        return of(null)
      })
    )
  }

  async getUserAsync(username: string): Promise<AppUser | null> {
    return await firstValueFrom(this.getUser$(username))
  }

  getUsers(filter: string, roles: number[]): Observable<AppUser[]> {

    const body = {
      appName: environment.appName,
      roles: roles,
    }

    return this.http.post<any[]>(`${environment.authUrl}/user/getUsersByRoles`, body).pipe(
      map(r => {
        return r.filter(o => this.filter(o, filter.toLowerCase())).map(user => this.mapUser(user))
      })
    )
  }

  private filter(o: AppUser, value: string): boolean {
    return o.name?.toLowerCase().startsWith(value)
      || o.surname?.toLowerCase().startsWith(value)
      || o.userName.toLowerCase().startsWith(`${environment.domain}\\${value}`)
  }

  // getCandidateUsers(queryString: string): Observable<AppUser[]> {
  //   return this.http.post<any[]>(`${environment.authUrl}/user/findAllDomain/${environment.domain}`, {userName: `${environment.domain}\\`}).pipe(
  //     map(r => {
  //       return r.filter(o => this.filter(o, queryString.toLowerCase()))
  //         .map(o => <AppUser>{
  //           userName: o.userName.toLowerCase(),
  //           surname: o.surname.charAt(0).toUpperCase() + o.surname.slice(1).toLowerCase(),
  //           name: o.name.charAt(0).toUpperCase() + o.name.slice(1).toLowerCase(),
  //           displayName: `${o.surname.charAt(0).toUpperCase() + o.surname.slice(1).toLowerCase()} ${o.name.charAt(0).toUpperCase() + o.name.slice(1).toLowerCase()}`,
  //           email: o.email.toLowerCase(),
  //           telephoneNumber: o.telephoneNumber
  //         })
  //         .sort((a,b) => (a.displayName > b.displayName) ? 1 : ((b.displayName > a.displayName) ? -1 : 0))
  //     })
  //   )
  // }

  getCandidateUsers(data: any): Observable<AppUser[]> {
    return this.http.post<any[]>(`${environment.authUrl}/user/findAllDomain/${environment.domain}`, data).pipe(
      map(r => {
        return r
        .map(user => this.mapUser(user))
        .sort((a,b) => (a.displayName > b.displayName) ? 1 : ((b.displayName > a.displayName) ? -1 : 0))
      })
    )
  }

  setRoles(data: any): Observable<AppUser> {
    return this.http.post<any>(`${environment.authUrl}/user/save`, data).pipe(
      map(user => {return this.mapUser(user)})
    )
  }

  private mapUser(u: any): AppUser {
    return <AppUser> {
      userName: u.userName.toLowerCase(),
      surname: !!u.surname ? u.surname.charAt(0).toUpperCase() + u.surname.slice(1).toLowerCase() : '',
      name: !!u.name ? u.name.charAt(0).toUpperCase() + u.name.slice(1).toLowerCase() : '',
      displayName: `${u.surname?.charAt(0).toUpperCase() + u.surname?.slice(1).toLowerCase()} ${u.name?.charAt(0).toUpperCase() + u.name?.slice(1).toLowerCase()}`,
      email: u.email?.toLowerCase(),
      telephoneNumber: u.telephoneNumber,
      roles: u.roles.map((r: { roleId: number, roleCd: string }) => <AppRole>{
        id: r.roleId,
        name: r.roleCd
      })
    }
  }


}
