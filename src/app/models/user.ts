export class User {
  public name = ''
  public expirationTime!: Date
  public issuedAt!: Date
  public notBefore!: Date
  public roles: string[] = []
  public firstName = ''
  public lastName = ''
  public displayName = ''
  public email = ''
  public passwordExpirationDays: number | null = null
}
