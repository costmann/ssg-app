export interface AppRole {
  id: number
  name: string
  description: string
}

export interface AppUser {
  userName: string
  surname: string
  name: string
  email: string
  telephoneNumber: string
  displayName: string
  roles: AppRole[]
}
