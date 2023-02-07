export interface Step {
  id: number

  issueId: number
  issueCode: string

  stateCode: string
  stateName: string

  recipientUser: string

  notes: string

  createdBy: string
  createdAt: Date
}
