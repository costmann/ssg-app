import { BehaviorSubject, Observable, catchError, combineLatest, concat, concatMap, map, switchMap } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { LoginResponse } from '../models/login-response';
import { MenuItem } from '../models/menu-item';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private tokenKey = 'auth-token'
  private userKey = 'auth-user'

  private userSubject: BehaviorSubject<User | undefined>
  public user$: Observable<User | undefined>

  public redirectUrl: string | undefined

  constructor(private http: HttpClient, private router: Router) {
    let u: User | undefined
    const json = window.sessionStorage.getItem(this.userKey)
    if (!!json) {
      u = JSON.parse(json)
    }

    this.userSubject = new BehaviorSubject<User | undefined>(u)
    this.user$ = this.userSubject.asObservable()

  }

  public showLogin(): void {
    this.router.navigate(['/login'])
  }

  login(appname: string, username: string, password: string): Observable<User> {

    const body = {
      AppName: appname,
      UserName: username,
      Password: password,
    }

    return this.http.post<LoginResponse>(`${environment.authUrl}/user/authenticate`, body, httpOptions).pipe(
      map(result => {
        const user = this.createUser(result)
        window.sessionStorage.setItem(this.tokenKey, result.token)
        window.sessionStorage.setItem(this.userKey, JSON.stringify(user))
        this.userSubject.next(user)
        return user
      }),
      catchError(e => {
        if (e.status === 401) {
          throw new Error(e.error.message)
        }
        if (e.status === 500) {
          throw new Error('Internal server error')
        }
        throw new Error('Unable to connect')
      })
    )
  }

  logout(): void {
    this.router.navigate(["/"]).then(() => {
      window.sessionStorage.clear()
      this.redirectUrl = "/login"
      this.userSubject.next(undefined)
    })
  }

  public get userValue(): User | undefined {
    return this.userSubject.value
  }

  public getToken(): string | null {
    return window.sessionStorage.getItem(this.tokenKey)
  }

  public isLoggedIn(): boolean {
    return !!window.sessionStorage.getItem(this.tokenKey)
  }

  public isInRole(roles: string[]): boolean {
    if (!!this.userValue) {
      return this.inRole(this.userValue, roles)
    }
    return false
  }

  private inRole(u: User, roles: string[]): boolean {
    return roles.filter(x => u.roles.indexOf(x) !== -1).length > 0
  }

  private createUser(data: LoginResponse): User {
    const user = new User()

    user.passwordExpirationDays = data.passwordExpirationDays
    const helper = new JwtHelperService()
    const token = helper.decodeToken(data.token)

    let key = 'winaccountname'
    user.name = token[key]
    key = 'unique_name'
    user.firstName = token[key]
    key = 'family_name'
    user.lastName = token[key]

    user.displayName = `${user.firstName} ${user.lastName}`

    key = 'email'
    user.email = token[key]

    key = 'role'
    const r = token[key]
    if (Array.isArray(r) === true)
      user.roles = r
    else
      user.roles.push(r)

    key = 'iat'
    user.issuedAt = new Date(token[key] * 1000)
    key = 'exp'
    user.expirationTime = new Date(token[key] * 1000)
    key = 'nbf'
    user.notBefore = new Date(token[key] * 1000)

    user.passwordExpirationDays = data.passwordExpirationDays

    return user
  }

}
