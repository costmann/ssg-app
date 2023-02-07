import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatDrawerMode, MatSidenav } from '@angular/material/sidenav';

import { AuthService } from 'src/app/services/auth.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { MenuItem } from '../../../models/menu-item';
import { MenuService } from 'src/app/services/menu.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { SidenavService } from './../../../services/sidenav.service';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-sidemenu',
  templateUrl: './sidemenu.component.html',
  styleUrls: ['./sidemenu.component.scss']
})
export class SidemenuComponent implements AfterViewInit {

  @ViewChild('sidenav') sidenav!: MatSidenav

  public opened = false

  extended = true

  backdrop = false
  mode: MatDrawerMode = 'side'
  mobile = false

  @Input() title = ''
  @Input() user: User | undefined

  menu$: Observable<MenuItem[]>

  @Output() logout = new EventEmitter()

  constructor(
    private deviceService: DeviceDetectorService,
    public sidenavService: SidenavService,
    public router: Router,
    menuService: MenuService
  )
  {

    this.menu$ = menuService.getMenu()

    this.mobile = this.deviceService.isMobile()
    if (this.mobile) {
      this.backdrop = true
      this.mode = 'over'
      this.opened = false
      this.extended = true
      window.localStorage.removeItem('egp.ssg.app.menu.opened')
    } else {
      let value = window.localStorage.getItem('egp.ssg.app.menu.opened')
      if (!!value) {
        this.opened = (value === 'true')
      } else {
        this.opened = true
      }

      value = window.localStorage.getItem('egp.ssg.app.menu.extended')
      if (!!value) {
        this.extended = (value === 'true')
      } else {
        this.extended = true
      }
    }

  }

  ngAfterViewInit(): void {
    this.sidenav.openedChange.subscribe({
      next: (value: boolean) => {
        this.opened = value
        if (this.mobile === false) {
          window.localStorage.setItem('egp.ssg.app.menu.opened', this.sidenav.opened.toString())
        }
      }
    })
  }

  toggle(): void {
    if (this.mobile) {
      this.sidenav.toggle()
    } else {
      //this.opened = !this.opened
      this.extended = !this.extended
      window.localStorage.setItem('egp.ssg.app.menu.extended', this.extended.toString())
      //window.localStorage.setItem('egp.ssg.app.menu.expanded', this.opened.toString())
      // if (this.opened) {
      //   // if (this.expanded) {
      //   //   this.expanded = false
      //   //   window.localStorage.setItem('egp.ssg.app.menu.expanded', 'false')
      //   // } else {
      //   //   this.sidenav.toggle()
      //   // }
      //   this.sidenav.toggle()
      // } else {
      //   //this.expanded = true
      //   //window.localStorage.setItem('egp.ssg.app.menu.expanded', 'true')
      //   this.sidenav.toggle()
      // }
    }
  }

  onItemSelected(item: MenuItem): void {

    console.dir(item)

    if (item.route !== undefined) {
      this.sidenavService.navigate(item.route)
      if (this.mobile) {
        this.sidenav.close()
      }
    }
  }

  isExpanded(item: MenuItem): boolean {
    return !!window.sessionStorage.getItem(`egp.ssg.app.menu.item.${item.displayName}`)
  }

}
