export interface MenuItem {
  displayName: string
  iconName: string
  route: string
  roles: string[]
  children?: MenuItem[]
}
