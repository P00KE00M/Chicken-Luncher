import { initDatabase } from './database'
import { randomUUID } from 'crypto'
import * as fs from 'fs'
import * as path from 'path'

export interface Profile {
  id: string
  name: string
  username: string
  version: string
  mods: string[]
}

const db = () => initDatabase()

export function getProfiles(): Profile[] {
  const store = db()
  const data = store.get('profiles')
  return data ? JSON.parse(data) : []
}

export function saveProfile(profile: Profile) {
  const profiles = getProfiles()
  const idx = profiles.findIndex(p => p.id === profile.id)
  if (idx >= 0) profiles[idx] = profile
  else profiles.push(profile)
  db().set('profiles', JSON.stringify(profiles))
}

export function deleteProfile(id: string) {
  const profiles = getProfiles().filter(p => p.id !== id)
  db().set('profiles', JSON.stringify(profiles))
}

export function createProfile(name: string, username: string, version: string): Profile {
  const profile: Profile = { id: randomUUID(), name, username, version, mods: [] }
  saveProfile(profile)
  return profile
}
