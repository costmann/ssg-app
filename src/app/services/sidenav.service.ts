import { ActivatedRoute, NavigationEnd, Router, UrlSegment } from '@angular/router';
import { BehaviorSubject, Observable, delay, filter, map, switchMap } from 'rxjs';

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidenavService {

  private pathSubject: BehaviorSubject<string>
  public path$: Observable<string>

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {

    this.pathSubject = new BehaviorSubject<string>('')
    this.path$ = this.pathSubject.asObservable()

    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => this.activatedRoute),
      map((route) => {
        return route.children[0]
      }),
      switchMap((route) => route.url),
      delay(0)
    ).subscribe((url) => {
      if (url.length === 0) {
        this.pathSubject.next('')
        return
      }

      const s: UrlSegment = url[0]
      this.pathSubject.next(s.path)
    })

  }

  navigate(url: string): void {
    this.router.navigate([url])
    this.pathSubject.next(url)
  }
}
