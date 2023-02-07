export interface Attribute {
  id: number
  areaId: number
  name: string
  dataTypeName: string
  dataTypeDescription: string
  dataTypeElement: string
  dataTypeInput: string
  required: boolean
  position: number
  isInUse: boolean
}

export interface SaveAttribute {
  id: number | null
  areaId: number
  name: string
  dataTypeName: string
  required: boolean
  position: number | null
}
