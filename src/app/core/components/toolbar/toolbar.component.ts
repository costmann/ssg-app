import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { User } from 'src/app/models/user';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  @Output() toggle = new EventEmitter<boolean>()
  @Input() opened = false
  @Input() mobile = false
  @Input() extended = false
  @Output() logout = new EventEmitter()

  @Input() title = ''
  @Input() user: User | undefined

  constructor() { }

  ngOnInit(): void {
  }

  getIcon(): string {
    return this.opened ? (this.mobile ? 'close' : (this.extended ? 'menu_open' : 'menu') ) : 'menu'
  }
}
