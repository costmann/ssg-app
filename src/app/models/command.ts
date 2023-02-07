import { AppUser } from './app-user';

export interface Command {
  commandName: string
  initialState: string
  finalState: string
  roles: string[]
}

export interface ExecuteCommand {
  id: number
  recipient: AppUser
  systemId: number | undefined
  equipmentId: number | undefined
  notes: string
  commandName: string
}
