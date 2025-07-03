export interface SessionHost {
  photo: string;
  firstName: string;
  lastName: string;
  profession: string;
}

export interface SessionUser {
  email: string;
  firstName: string;
  lastName: string;
  timeZone: string;
}

export interface SessionService {
  title: string;
}

export interface SessionPage {
  date: string;
  time: string;
  duration: number;
  host: SessionHost;
  user: SessionUser;
  service: SessionService;
}

export interface TimeRange {
  start: string; // AWSTime format
  end: string; // AWSTime format
}

export interface DateAvailability {
  date: string;
  times: TimeRange[];
}

// UI-specific interfaces
export interface CalendarDate {
  day: number;
  date: string; // YYYY-MM-DD format
  isAvailable: boolean;
  isSelected: boolean;
  isCurrentMonth: boolean;
  isPastDate: boolean;
}

export interface CalendarMonth {
  year: number;
  month: number; // 0-11
  monthName: string;
  dates: CalendarDate[];
}

export interface BookingState {
  selectedDate?: string;
  selectedTime?: string;
  currentStep: BookingStep;
  sessionData?: SessionPage;
  availabilities?: DateAvailability[];
}

export enum BookingStep {
  DATE_SELECTION = 1,
  TIME_SELECTION = 2,
  CONFIRMATION = 3,
  COMPLETION = 4,
}
