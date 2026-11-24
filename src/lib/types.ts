export type Role = 'CUSTOMER' | 'STAFF' | 'MANAGER'

export type UserGroup = 'STUDENT' | 'LECTURER_STAFF'

export type FeeGroup = UserGroup | 'GUEST'

export type VehicleTypeCode = 'MOTORBIKE' | 'CAR'

export type IdMethod = 'PLATE' | 'QR' | 'RFID'

export type SessionStatus = 'OPEN' | 'CLOSED'

export type ReservationStatus = 'PENDING' | 'CANCELLED' | 'NO_SHOW' | 'FULFILLED'

export type LotStatus = 'ACTIVE' | 'SUSPENDED'

export type SessionEventType = 'PLATE_MISMATCH_CONFIRMED' | 'LOST_CARD' | 'EARLY_ARRIVAL_CONFIRMED'

export type NotificationType = 'LOT_SUSPENDED'

/** Simulated gates of the pilot lot (G-09, FR-09). */
export const GATES = ['GATE-1', 'GATE-2'] as const
export type GateCode = (typeof GATES)[number]
export const DEFAULT_GATE: GateCode = 'GATE-1'

/** Who recorded an entry or exit (G-04, FR-10): the simulated device or Staff by hand. */
export const SOURCES = ['DEVICE', 'MANUAL'] as const
export type SessionSource = (typeof SOURCES)[number]
export const DEFAULT_SOURCE: SessionSource = 'DEVICE'

export type AccessAction =
  | 'LOGIN'
  | 'LOGIN_FAILED'
  | 'ACCESS_DENIED'
  | 'LOGOUT'
  | 'VIEW_FULL_PLATE'
  | 'ENTRY'
  | 'EXIT'
  | 'MANUAL_CONFIRM'
  | 'LOT_CHANGE'
  | 'TARIFF_CHANGE'
  | 'ACCOUNT_CHANGE'
  | 'PURGE'
