import { describe, it, expect } from 'vitest'
import { parseLookupQuery } from '@/lib/lookupQuery'

// Review of PR #11 (A-65, G-08): the lookup page's query string is untrusted.

describe('parseLookupQuery: the query string is untrusted', () => {
  it('rejects a repeated identifier or method instead of throwing', () => {
    expect(parseLookupQuery({ identifier: ['a', 'b'] }).kind).toBe('invalid')
    expect(parseLookupQuery({ method: ['QR', 'RFID'], identifier: 'x' }).kind).toBe('invalid')
  })

  it('rejects an unknown method', () => {
    expect(parseLookupQuery({ method: 'EMAIL', identifier: 'x' }).kind).toBe('invalid')
  })

  it('treats a missing or blank identifier as no search, and trims a real one', () => {
    expect(parseLookupQuery({})).toEqual({ kind: 'empty', method: 'PLATE', identifier: '' })
    expect(parseLookupQuery({ identifier: '   ' }).kind).toBe('empty')
    expect(parseLookupQuery({ method: 'RFID', identifier: ' R1 ' })).toEqual({
      kind: 'search',
      method: 'RFID',
      identifier: 'R1',
    })
  })
})
