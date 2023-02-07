import { first, Observable } from 'rxjs';
import { Component, ElementRef, EventEmitter, Inject, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Area } from 'src/app/models/area';
import { AttributeService } from 'src/app/services/attribute.service';
import { Attribute, SaveAttribute } from 'src/app/models/attribute';
import { FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { DataType } from 'src/app/models/data-type';

@Component({
  selector: 'app-attributes-dialog',
  templateUrl: './attributes-dialog.component.html',
  styleUrls: ['./attributes-dialog.component.scss']
})
export class AttributesDialogComponent implements OnInit {

  form: FormGroup
  idAreaControl: FormControl
  idControl: FormControl
  nameControl: FormControl
  dataTypeControl: FormControl
  requiredControl: FormControl
  positionControl: FormControl

  attributes$: Observable<Attribute[]>

  @ViewChild('fieldName') fieldName!: ElementRef

  displayedColumns: string[] = ['name', 'dataType', 'required', 'actions']

  @Output() onChange = new EventEmitter<any>(true)

  currentAttribute: Attribute | undefined

  dataTypes$: Observable<DataType[]>

  constructor(
    public dialogRef: MatDialogRef<AttributesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Area,
    private attributeService: AttributeService,
  ) {
    this.dataTypes$ = attributeService.getDataTypes()
    this.attributes$ = attributeService.getAttributes(data.id)

    this.idControl = new FormControl(null)
    this.idAreaControl = new FormControl(data.id, [Validators.required])
    this.nameControl = new FormControl(null, [Validators.required])
    this.dataTypeControl = new FormControl(null, [Validators.required])
    this.requiredControl = new FormControl(false,  {initialValueIsDefault: true})
    this.positionControl = new FormControl(null)

    this.form = new FormGroup({
      id: this.idControl,
      areaId: this.idAreaControl,
      name: this.nameControl,
      dataTypeName: this.dataTypeControl,
      required: this.requiredControl,
      position: this.positionControl,
    })
  }

  ngOnInit(): void {
  }

  onSubmit(formDirective: FormGroupDirective): void {

    // if (this.form.invalid) {
    //   return
    // }

    this.dataTypeControl.enable()
    this.idAreaControl.setValue(this.data.id)

    const data: SaveAttribute = this.form.value
    console.dir(this.form.value)

    const obs$ = (!!data.id) ? this.attributeService.updateAttribute(data) : this.attributeService.addAttribute(data)

    obs$.pipe(first()).subscribe({
      next: () => {
        formDirective.resetForm()
        this.attributes$ = this.attributeService.getAttributes(this.data.id)
        this.fieldName.nativeElement.focus()
        console.dir(this.form.value)
        this.onChange.emit()
      }
    })

  }

  deleteAttribute(id: number, formDirective: FormGroupDirective): void {
    this.attributeService.deleteAttribute(id).pipe(first()).subscribe({
      next: () => {
        this.attributes$ = this.attributeService.getAttributes(this.data.id)

        formDirective.resetForm()

        this.fieldName.nativeElement.focus()

        this.onChange.emit()
      }
    })
  }

  addAttribute(formDirective: FormGroupDirective): void {
    this.currentAttribute = undefined
    formDirective.resetForm()
    this.dataTypeControl.enable()
    this.fieldName.nativeElement.focus()
  }

  editAttribute(a: Attribute, formDirective: FormGroupDirective): void {

    if (this.currentAttribute === a) {
      this.addAttribute(formDirective)
      return
    }

    this.currentAttribute = a
    this.form.setValue({
      id: a.id,
      areaId: a.areaId,
      name: a.name,
      dataTypeName: a.dataTypeName,
      required: a.required,
      position: a.position
    })

    this.dataTypeControl.disable()

  }

  isInvalid(): boolean {
    return this.form.invalid
  }

}
