import { describe, it, expect } from 'vitest'
import { normalizePlate, plateCompareKey, maskPlate, presentPlate, presentEventNote, observedPlateNote } from '@/lib/plate'
import { Role } from '@/lib/types'

describe('plate helpers', () => {
  describe('plateCompareKey', () => {
    it('gives the same key for separator and case variants (A-63, KB-04)', () => {
      const key = plateCompareKey('51F-123.45')
      expect(key).toBe('51F12345')
      expect(plateCompareKey('51f 123 45')).toBe(key)
      expect(plateCompareKey('51F12345')).toBe(key)
    })

    it('gives a different key for a different plate', () => {
      expect(plateCompareKey('51F-999.99')).not.toBe(plateCompareKey('51F-123.45'))
    })
  })

  describe('normalizePlate', () => {
    it('should trim and uppercase and remove whitespace', () => {
      expect(normalizePlate(' 51f 123.45 ')).toBe('51F123.45')
    })

    it('should preserve hyphen', () => {
      expect(normalizePlate('51f-123.45')).toBe('51F-123.45')
    })
  })

  describe('maskPlate', () => {
    it('shows only the last 3 letters or digits, keeping separators (SRS FR-42)', () => {
      expect(maskPlate('51F-123.45')).toBe('***-**3.45')
      expect(maskPlate('29A12345')).toBe('*****345')
      expect(maskPlate('59X1-678.90')).toBe('****-**8.90')
    })

    it('masks a short plate too, so a masked value never equals the plate (review of PR #11)', () => {
      expect(maskPlate('51F-12')).toBe('**F-12')
      expect(maskPlate('51F-1')).toBe('*1F-1')
      expect(maskPlate('29A12')).toBe('**A12')
      expect(maskPlate('29A')).toBe('*9A')
      expect(maskPlate('AB')).toBe('*B')
      expect(maskPlate('A')).toBe('*')
      expect(maskPlate('51F-')).toBe('*1F-')
      // Separators must not hide the masking (second review of PR #11).
      expect(maskPlate('51F-.12')).toBe('**F-.12')
      expect(maskPlate('29A.12')).toBe('**A.12')
      expect(maskPlate('51F-..12')).toBe('**F-..12')
      expect(maskPlate('51F-1.2.3')).toBe('***-1.2.3')
      for (const p of ['51F-12', '51F-1', '29A12', '29A', 'AB', 'A', '51F-', '51F-123.45', '29A12345', '51F-.12', '29A.12', '-12', '.-.1']) {
        expect(maskPlate(p)).not.toBe(p)
        expect(maskPlate(p)).toContain('*')
      }
    })

    it('every plate with a letter or digit is changed and keeps its length and separators', () => {
      // Deterministic pseudo-random plates over letters, digits and separators.
      let seed = 42
      const next = () => (seed = (seed * 1103515245 + 12345) % 2147483648)
      const alphabet = 'AB51F9x-.- '
      for (let k = 0; k < 2000; k++) {
        const len = 1 + (next() % 10)
        let p = ''
        for (let i = 0; i < len; i++) p += alphabet[next() % alphabet.length]
        const m = maskPlate(p)
        expect(m.length).toBe(p.length)
        expect(m.replace(/[a-zA-Z0-9*]/g, '')).toBe(p.replace(/[a-zA-Z0-9]/g, ''))
        if (/[a-zA-Z0-9]/.test(p)) {
          expect(m, p).not.toBe(p)
          expect(m, p).toContain('*')
        }
      }
    })
  })

  describe('presentPlate', () => {
    const staff = { id: 's', role: 'STAFF' as Role }
    const manager = { id: 'm', role: 'MANAGER' as Role }
    const cust = { id: 'c', role: 'CUSTOMER' as Role }

    it('should show full plate to STAFF', () => {
      expect(presentPlate('51F-123.45', staff, null)).toBe('51F-123.45')
    })

    it('should show full plate to MANAGER', () => {
      expect(presentPlate('51F-123.45', manager, null)).toBe('51F-123.45')
    })

    it('should show full plate when viewer is owner', () => {
      expect(presentPlate('51F-123.45', cust, 'c')).toBe('51F-123.45')
    })

    it('should mask plate to non-staff non-owner', () => {
      expect(presentPlate('51F-123.45', cust, 'other')).toBe('***-**3.45')
    })

    it('should pass through purged marker', () => {
      expect(presentPlate('[purged]', cust, null)).toBe('[purged]')
    })

    it('Q46: masks a closed session for STAFF, but not for MANAGER or the owner', () => {
      expect(presentPlate('51F-123.45', staff, null, true)).toBe('***-**3.45')
      expect(presentPlate('51F-123.45', manager, null, true)).toBe('51F-123.45')
      expect(presentPlate('51F-123.45', { id: 'c', role: 'CUSTOMER' }, 'c', true)).toBe('51F-123.45')
      expect(presentPlate('51F-123.45', staff, null, false)).toBe('51F-123.45')
    })

    it('presentEventNote masks only the observed plate of an EX-02 note', () => {
      const note = observedPlateNote('51F-123.45', 'worn plate')
      expect(note).toBe('Observed plate: 51F-123.45 — worn plate')
      const EX02 = 'PLATE_MISMATCH_CONFIRMED'
      expect(presentEventNote(note, EX02, false)).toBe('Observed plate: ***-**3.45 — worn plate')
      expect(presentEventNote(note, EX02, true)).toBe(note)
      expect(presentEventNote('Observed plate: 51F-12', EX02, false)).toBe('Observed plate: **F-12')
      expect(presentEventNote('Observed plate: [purged]', EX02, false)).toBe('Observed plate: [purged]')
      expect(presentEventNote('Reserved arrival: 2026-11-23T08:00:00.000Z', 'EARLY_ARRIVAL_CONFIRMED', false)).toBe(
        'Reserved arrival: 2026-11-23T08:00:00.000Z',
      )
      // A LOST_CARD note is staff text: not reformatted even if it starts the same way.
      expect(presentEventNote('Observed plate: hard to read', 'LOST_CARD', false)).toBe('Observed plate: hard to read')
    })

    it('should mask plate to null viewer', () => {
      expect(presentPlate('51F-123.45', null, 'other')).toBe('***-**3.45')
    })
  })
})
