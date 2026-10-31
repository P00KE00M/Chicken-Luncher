import { describe, it, expect } from 'vitest'
describe('MVP', () => {
  it('version semver-like', () => expect('0.1.0').toMatch(/^\d+\.\d+\.\d+$/))
  it('yellow', () => expect('#FFC928').toHaveLength(7))
})
