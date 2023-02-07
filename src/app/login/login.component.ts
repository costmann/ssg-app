import { ActivatedRoute, Router } from '@angular/router';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription, first, map } from 'rxjs';

import { AuthService } from '../services/auth.service';
import { User } from '../models/user';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, AfterViewInit {

  private savedUserKey = 'egp.ssg.app.menu.saveduser'

  canRecoveryPassword = false

  appFormControl = new FormControl(environment.appName, [Validators.required])
  userFormControl = new FormControl('', [Validators.required])
  passwordFormControl = new FormControl('', [Validators.required])
  rememberFormControl = new FormControl(true)

  loginForm = new FormGroup({
    appname: this.appFormControl,
    username: this.userFormControl,
    password: this.passwordFormControl,
    remember: this.rememberFormControl,
  })

  hidePassword = true

  loginFailed = false
  loggedIn = false
  errorMessage = ''
  private _loggingIn = false

  @ViewChild('username') username!: ElementRef
  @ViewChild('password') password!: ElementRef

  constructor(public authService: AuthService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    const username = window.localStorage.getItem(this.savedUserKey)
    this.userFormControl.setValue(username)
  }

  ngAfterViewInit(): void {
    setTimeout(()=> {
      if (!this.username.nativeElement.value) {
        this.username.nativeElement.focus()
        return
      }
      this.password.nativeElement.focus()
    }, 0)
  }

  onPasswordLost(): void {

  }

  onSubmit(): void {
    if ((this.loginForm.valid === false) || (this.loggingIn === true) || (this.loggedIn === true)) {
      return
    }

    if (this.authService.redirectUrl === undefined) {
      this.authService.redirectUrl = ''
    }


    const { appname, username, password } = this.loginForm.value

    this.errorMessage = ''
    this.loggingIn = true
    this.loginFailed = false



    this.authService.login(appname!, username!, password!).pipe(first()).subscribe({
      next: (u) => {

        // this.authService.saveLogin(u).pipe(first()).subscribe()
        this.loggedIn = true
        this.loggingIn = false

        if (this.rememberFormControl.value === true) {
          window.localStorage.setItem(this.savedUserKey, u.name)
        } else {
          window.localStorage.removeItem(this.savedUserKey)
        }
      },
      error: (e) => {
        this.errorMessage = e.message
        this.loggingIn = false
        this.loginFailed = true
      }
    })

  }

  public set loggingIn(value: boolean) {
    this._loggingIn = value

    if (value) {
      this.userFormControl.disable()
      this.passwordFormControl.disable()
      this.rememberFormControl.disable()
    } else {
      this.userFormControl.enable()
      this.passwordFormControl.enable()
      this.rememberFormControl.enable()
    }


  }

  public get loggingIn(): boolean {
    return this._loggingIn
  }

}
