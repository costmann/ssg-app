import { Directive, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';

import { AppUserService } from '../services/app-user.service';
import { first } from 'rxjs';

class UserContext {
  public get $implicit() {
    return this.name ?? this.id
  }
  public id = ''
  public name = ''
  public email = ''
  public phone = ''
}

@Directive({
  selector: '[ssgUser]'
})
export class UserDirective implements OnInit {

  @Input("ssgUser")
  set id(value: string | null) {
    this._id = value ?? ''
    this.context.name = this.context.id = this._id
  }
  private _id = ''

  private context = new UserContext()

  constructor(
    private viewContainerRef: ViewContainerRef,
    private template: TemplateRef<any>,
    private userService: AppUserService
  ) { }

  ngOnInit(): void {
    this.viewContainerRef.createEmbeddedView(this.template, this.context)
    if (!!this._id) {
      this.userService.getUser(this._id).pipe(first()).subscribe({
        next: (user) => {
          this.context.name = user.displayName
          this.context.email = user.email
          this.context.phone = user.telephoneNumber
        }
      })
    }
  }

}


