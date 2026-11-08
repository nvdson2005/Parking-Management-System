import { describe, it, expect } from 'vitest'
import { DomainError } from '@/server/errors'

describe('errors', () => {
  describe('error status mappings', () => {
    it('should map UNKNOWN_CODE to 404', () => {
      const err = new DomainError('UNKNOWN_CODE', 'Unknown error code')
      expect(err.status).toBe(404)
    })

    it('should map LOT_SUSPENDED to 409', () => {
      const err = new DomainError('LOT_SUSPENDED', 'Lot is suspended')
      expect(err.status).toBe(409)
    })

    it('should map NO_OPEN_SESSION to 404', () => {
      const err = new DomainError('NO_OPEN_SESSION', 'No open session')
      expect(err.status).toBe(404)
    })

    it('should map PLATE_MISMATCH to 409', () => {
      const err = new DomainError('PLATE_MISMATCH', 'Plate mismatch')
      expect(err.status).toBe(409)
    })
  })

  describe('DomainError class', () => {
    it('should extend Error', () => {
      const err = new DomainError('VALIDATION', 'Invalid input')
      expect(err).toBeInstanceOf(Error)
      expect(err.name).toBe('DomainError')
    })

    it('should store code and status', () => {
      const err = new DomainError('NOT_FOUND', 'Resource not found')
      expect(err.code).toBe('NOT_FOUND')
      expect(err.status).toBe(404)
    })

    it('should preserve message', () => {
      const message = 'Test error message'
      const err = new DomainError('FORBIDDEN', message)
      expect(err.message).toBe(message)
    })
  })
})
