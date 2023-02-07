import { AuthService } from './services/auth.service';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SidenavService } from './services/sidenav.service';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  title = 'Fault Reporting System'

  constructor(
    translate: TranslateService,
    public authService: AuthService,
    private sidenavService: SidenavService,
    public dialog: MatDialog
  ) {

    if (!this.isValidHttpUrl(environment.authUrl)) {
      environment.authUrl = window.location.origin + environment.authUrl
    }

    if (!this.isValidHttpUrl(environment.apiUrl)) {
      environment.apiUrl = window.location.origin + environment.apiUrl
    }
    
    if (!this.isValidHttpUrl(environment.emailUrl)) {
      environment.emailUrl = window.location.origin + environment.emailUrl
    }

    translate.addLangs(['en', 'it'])
    translate.setDefaultLang('en')
    translate.use('it')

    this.authService.user$.subscribe({
      next: (user) => {
        if (this.authService.redirectUrl !== undefined) {
          this.sidenavService.navigate(this.authService.redirectUrl)
          this.authService.redirectUrl = undefined
        }
      }
    })

  }

  signOut(): void {
    this.authService.logout()
  }

  isValidHttpUrl(value: string) {
    try {
      const url = new URL(value);
      return url.protocol === 'http:' || url.protocol === 'https:'
    } catch (err) {
      return false
    }
  }

}
