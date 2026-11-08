export type Role = 'CUSTOMER' | 'STAFF' | 'MANAGER'

export type UserGroup = 'STUDENT' | 'LECTURER_STAFF'

export type FeeGroup = UserGroup | 'GUEST'

export type VehicleTypeCode = 'MOTORBIKE' | 'CAR'

export type IdMethod = 'PLATE' | 'QR' | 'RFID'

export type SessionStatus = 'OPEN' | 'CLOSED'

export type ReservationStatus = 'PENDING' | 'CANCELLED' | 'NO_SHOW' | 'FULFILLED'

export type LotStatus = 'ACTIVE' | 'SUSPENDED'

export type SessionEventType = 'PLATE_MISMATCH_CONFIRMED' | 'LOST_CARD'

export type AccessAction =
  | 'LOGIN'
  | 'LOGOUT'
  | 'VIEW_FULL_PLATE'
  | 'ENTRY'
  | 'EXIT'
  | 'MANUAL_CONFIRM'
  | 'LOT_CHANGE'
  | 'TARIFF_CHANGE'
  | 'ACCOUNT_CHANGE'
  | 'PURGE'
