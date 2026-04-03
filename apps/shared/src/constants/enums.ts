export const STAFF_STATUS = {
  ACTIVE:    'active',
  INACTIVE:  'inactive',
  SUSPENDED: 'suspended',
} as const;

export const ROUTE_STATUS = {
  ACTIVE:    'active',
  INACTIVE:  'inactive',
  SUSPENDED: 'suspended',
} as const;

export const BUS_TYPE = {
  MINI:    'mini',
  REGULAR: 'regular',
  AC:      'ac',
  DELUXE:  'deluxe',
} as const;

export const BUS_STATUS = {
  ACTIVE:      'active',
  INACTIVE:    'inactive',
  MAINTENANCE: 'maintenance',
} as const;

export const TRIP_STATUS = {
  SCHEDULED:   'scheduled',
  IN_PROGRESS: 'in_progress',
  COMPLETED:   'completed',
  CANCELLED:   'cancelled',
} as const;
