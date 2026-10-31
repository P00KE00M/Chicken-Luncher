import { initDatabase } from './database'
import { v4 as uuidv4 } from 'uuid'
import * as fs from 'fs'
import * as path from 'path'
import { app } from 'electron'

export interface Profile {
  id: string
  name: string
  username: string
  version: string
  mods: string[] // URLs
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
  const profile: Profile = { id: uuidv4(), name, username, version, mods: [] }
  saveProfile(profile)
  return profile
}

// Modrinth & Resource Pack Downloader
export async function installMod(profileId: string, projectId: string, type: 'mod' | 'resourcepack') {
  // ... (Implementation later in Phase 3, but UI exists now)
}
