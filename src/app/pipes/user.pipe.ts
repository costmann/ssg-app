import { Injectable, Pipe, PipeTransform } from '@angular/core';

import { AppUserService } from './../services/app-user.service';
import { first } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
@Pipe({
  name: 'user',
  pure: false
})
export class UserPipe implements PipeTransform {

  private cachedData: any = null
  private cachedValue: string | null = null

  constructor(private user: AppUserService) { }

  transform(value: string | null, extension: string = 'displayName'): string {

    if (!value) {
      return ''
    }

    if (value !== this.cachedValue) {
      this.cachedData = null
      this.cachedValue = value

      this.user.getUser(value).pipe(first()).subscribe({
        next: result => this.cachedData = result
      })

    }
    return !!this.cachedData ? this.cachedData[extension] : value
  }

}
