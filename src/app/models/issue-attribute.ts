export interface IssueAttribute {
  id: number
  issueId: number
  attributeId: number
  name: string
  dataTypeName: string
  dataTypeDescription: string
  dataTypeElement: string
  dataTypeInput: string
  required: boolean
  value: string | Date | number | boolean | null
  assetName: string | null
  updatedAt: Date | null
  updatedBy: string
}

export interface AttributeValue {
  id: number
  dataTypeName: string
  value: string | Date | number | boolean | null
}
