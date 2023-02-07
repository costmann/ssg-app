import { Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';

import { MenuItem } from 'src/app/models/menu-item';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu-list-item',
  templateUrl: './menu-list-item.component.html',
  styleUrls: ['./menu-list-item.component.scss'],
  animations: [
    trigger('indicatorRotate', [
      state('collapsed', style({transform: 'rotate(0deg)'})),
      state('expanded', style({transform: 'rotate(90deg)'})),
      transition('expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4,0.0,0.2,1)')
      ),
    ])
  ]
})
export class MenuListItemComponent {

  @Input() expanded = false
  @HostBinding('attr.aria-expanded') ariaExpanded = this.expanded
  @Input() item!: MenuItem
  @Input() depth = 0
  @Input() extended = true
  @Output() itemSelected = new EventEmitter<MenuItem>()
  padding = 0

  constructor(public router: Router) { }

  onItemSelected(item: MenuItem) {
    if (item.children && item.children.length) {
      this.expanded = !this.expanded

      if (this.expanded) {
        window.sessionStorage.setItem(`egp.ssg.app.menu.item.${item.displayName}`, this.expanded.toString())
      } else {
        window.sessionStorage.removeItem(`egp.ssg.app.menu.item.${item.displayName}`)
      }

      return
    }
    this.itemSelected.emit(item)
  }

}
