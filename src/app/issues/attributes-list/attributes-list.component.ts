import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable, first } from 'rxjs';

import { IssueAttribute } from './../../models/issue-attribute';
import { IssueAttributeService } from './../../services/issue-attribute.service';
import { Item } from './../../models/item';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-attributes-list',
  templateUrl: './attributes-list.component.html',
  styleUrls: ['./attributes-list.component.scss']
})
export class AttributesListComponent implements OnInit {

  _issueId: number | null = null

  // attributes$ = new Observable<IssueAttribute[]>()

  attributes: IssueAttribute[] = []

  form = new FormGroup({})

  observables:{ [key: string]: Observable<Item[]> } = {}

  constructor(
    private issueAttributeService: IssueAttributeService,
    public dialog: MatDialog)
  {}

  @Input()
  set issueId(value: number | null) {
    this._issueId = value
    if (!!this._issueId) {
      this.issueAttributeService.getAttributes(this._issueId).pipe(first()).subscribe({
        next: attributes => {
          console.table(attributes)
          this.attributes = attributes
          this.attributes.forEach(a => {
            this.form.addControl(a.id.toString(), new FormControl(a.value))

            if (a.dataTypeElement === 'select') {
              this.observables[a.dataTypeName] = this.issueAttributeService.getItems(a.dataTypeName)
            }
          })
        }
      })
    } else {
      this.attributes = []
      this.form = new FormGroup({})
    }
  }

  ngOnInit(): void {
  }

  

  onSubmitAttributes(): void {
   
   

    this.attributes.forEach(a => {
      this.issueAttributeService.updateAttribute({
        id: a.id,
        dataTypeName: a.dataTypeName,
        value: this.form.get(a.id.toString())?.value //this.form.controls[a.id].value
      }).pipe(first()).subscribe({
        next: () => {}
      })
    })

    // const data = this.form.value

    // console.dir(this.form.controls)

    //this.issueAttributeService.updateAttribute()
  }

}
