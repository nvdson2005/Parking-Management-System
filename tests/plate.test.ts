import { describe, it, expect } from 'vitest'
import { normalizePlate, plateCompareKey, maskPlate, presentPlate } from '@/lib/plate'
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
    it('should mask plate with hyphen', () => {
      expect(maskPlate('51F-123.45')).toBe('51F-***.45')
    })

    it('should mask plate without hyphen', () => {
      expect(maskPlate('29A12345')).toBe('29A***45')
    })

    it('should not mask if rest.length <= 2', () => {
      expect(maskPlate('51F-12')).toBe('51F-12')
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
      expect(presentPlate('51F-123.45', cust, 'other')).toBe('51F-***.45')
    })

    it('should pass through purged marker', () => {
      expect(presentPlate('[purged]', cust, null)).toBe('[purged]')
    })

    it('should mask plate to null viewer', () => {
      expect(presentPlate('51F-123.45', null, 'other')).toBe('51F-***.45')
    })
  })
})
