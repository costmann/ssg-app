export interface Email {
  from: string
  to: string[]
  cc: string[]
  subject: string
  message: string
  // attachments: any[]
}
