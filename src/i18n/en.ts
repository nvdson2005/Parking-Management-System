import type { Dict } from './index'

// English dictionary — must mirror `vi.ts`'s key shape exactly (checked by
// the `Dict` type below and by `tests/i18n.test.ts`).
export const en: Dict = {
  app: {
    name: 'Smart Parking',
  },
  nav: {
    customer: 'Customer',
    staff: 'Staff',
    manager: 'Manager',
    login: 'Log in',
    register: 'Register',
    logout: 'Log out',
    menu: 'Menu',
  },
  auth: {
    login: {
      title: 'Log in',
      email: 'Email',
      password: 'Password',
      submit: 'Log in',
      submitting: 'Logging in...',
      noAccount: "Don't have an account?",
      registerLink: 'Register now',
    },
    register: {
      title: 'Register',
      email: 'Email',
      password: 'Password',
      name: 'Full name',
      userGroup: 'User group',
      userGroupStudent: 'Student',
      userGroupLecturerStaff: 'Lecturer / Staff',
      submit: 'Register',
      submitting: 'Registering...',
      haveAccount: 'Already have an account?',
      loginLink: 'Log in',
    },
  },
  common: {
    loading: 'Loading...',
    networkError: 'Network error. Please try again.',
  },
  availability: {
    suspended: 'Suspended',
    zone: 'Zone',
    vehicleType: 'Vehicle type',
    free: 'Free',
    capacity: 'Capacity',
  },
  home: {
    customerTitle: 'Customer home',
    staffTitle: 'Staff home',
    managerTitle: 'Manager home',
  },
  errors: {
    VALIDATION: 'Invalid data',
    UNAUTHENTICATED: 'Please log in to continue',
    FORBIDDEN: 'You do not have permission to do this',
    INVALID_CREDENTIALS: 'Incorrect email or password',
    ACCOUNT_LOCKED: 'This account is locked',
    EMAIL_TAKEN: 'Email is already registered',
    PLATE_TAKEN: 'License plate is already registered',
    NOT_FOUND: 'Not found',
    UNKNOWN_CODE: 'Unknown code',
    ZONE_FULL: 'Zone is full',
    ALREADY_OPEN: 'A session is already open',
    LOT_SUSPENDED: 'Lot is temporarily suspended',
    NO_OPEN_SESSION: 'No open session',
    PLATE_MISMATCH: 'License plate does not match',
    RESERVATION_WINDOW: 'Outside the allowed reservation window',
    NOT_CANCELLABLE: 'This reservation cannot be cancelled',
    VEHICLE_ALREADY_RESERVED: 'Vehicle already has a reservation',
    VEHICLE_PARKED: 'Vehicle is currently parked',
    NOT_OWNER: 'You are not the owner of this vehicle',
  },
}
