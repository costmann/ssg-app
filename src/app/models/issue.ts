export interface Issue {
  id: number
  code: string

  description: string

  areaId: number
  areaDescription: string

  responsibleUser: string
  delegateUser: string

  plantId: number
  plantDescription: string
  plantSiteName: string

  recipientUser: string

  issuedAt: Date
  issuedBy: string

  stateCode: string
  stateName: string

}
