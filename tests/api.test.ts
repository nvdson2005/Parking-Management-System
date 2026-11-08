import { describe, it, expect } from 'vitest'
import { readJsonObject } from '@/server/api'

function post(body: BodyInit): Request {
  return new Request('http://test.local/api/events/entry', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
  })
}

describe('readJsonObject', () => {
  it('returns the parsed object for a valid JSON body', async () => {
    const result = await readJsonObject(post(JSON.stringify({ method: 'PLATE', zoneId: 'z1' })))
    expect(result).toEqual({ method: 'PLATE', zoneId: 'z1' })
  })

  it('maps malformed JSON to VALIDATION instead of throwing SyntaxError', async () => {
    await expect(readJsonObject(post('not json at all'))).rejects.toMatchObject({ code: 'VALIDATION' })
  })

  it('maps JSON null to VALIDATION instead of a later property access error', async () => {
    await expect(readJsonObject(post('null'))).rejects.toMatchObject({ code: 'VALIDATION' })
  })

  it('maps non-object JSON (array) to VALIDATION', async () => {
    await expect(readJsonObject(post('[1,2,3]'))).rejects.toMatchObject({ code: 'VALIDATION' })
  })

  it('maps non-object JSON (number) to VALIDATION', async () => {
    await expect(readJsonObject(post('42'))).rejects.toMatchObject({ code: 'VALIDATION' })
  })
})
