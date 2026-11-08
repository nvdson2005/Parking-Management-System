export type ErrorCode =
  | 'VALIDATION'
  | 'UNAUTHENTICATED'
  | 'FORBIDDEN'
  | 'INVALID_CREDENTIALS'
  | 'ACCOUNT_LOCKED'
  | 'EMAIL_TAKEN'
  | 'PLATE_TAKEN'
  | 'NOT_FOUND'
  | 'UNKNOWN_CODE'
  | 'ZONE_FULL'
  | 'ALREADY_OPEN'
  | 'LOT_SUSPENDED'
  | 'NO_OPEN_SESSION'
  | 'PLATE_MISMATCH'
  | 'RESERVATION_WINDOW'
  | 'NOT_CANCELLABLE'
  | 'VEHICLE_ALREADY_RESERVED'
  | 'VEHICLE_PARKED'
  | 'NOT_OWNER'

const STATUS_MAP: Record<ErrorCode, number> = {
  VALIDATION: 400,
  UNAUTHENTICATED: 401,
  FORBIDDEN: 403,
  INVALID_CREDENTIALS: 401,
  ACCOUNT_LOCKED: 403,
  EMAIL_TAKEN: 409,
  PLATE_TAKEN: 409,
  NOT_FOUND: 404,
  UNKNOWN_CODE: 500,
  ZONE_FULL: 409,
  ALREADY_OPEN: 409,
  LOT_SUSPENDED: 403,
  NO_OPEN_SESSION: 400,
  PLATE_MISMATCH: 400,
  RESERVATION_WINDOW: 400,
  NOT_CANCELLABLE: 400,
  VEHICLE_ALREADY_RESERVED: 409,
  VEHICLE_PARKED: 409,
  NOT_OWNER: 403,
}

export class DomainError extends Error {
  code: ErrorCode
  status: number

  constructor(code: ErrorCode, message: string) {
    super(message)
    this.name = 'DomainError'
    this.code = code
    this.status = STATUS_MAP[code]
  }
}
