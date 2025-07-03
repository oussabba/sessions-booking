import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
  SessionPage,
  DateAvailability,
  SessionHost,
  SessionService,
  SessionUser,
  TimeRange,
} from '../../models/session.interface';

@Injectable({
  providedIn: 'root',
})
export class SessionBookingService {
  constructor() {}

  /**
   * Mock implementation of getSessionPage query
   */
  getSessionPage(id: string): Observable<SessionPage> {
    // Mock session data
    const mockHost: SessionHost = {
      firstName: 'Jane',
      lastName: 'Doe',
      profession: 'Leadership Coach',
      photo:
        'https://images.unsplash.com/photo-1494790108755-2616b612b890?w=150&h=150&fit=crop&crop=face',
    };

    const mockUser: SessionUser = {
      firstName: 'John',
      lastName: 'Smith',
      email: 'john.smith@vibly.io',
      timeZone: 'Eastern European Time',
    };

    const mockService: SessionService = {
      title: 'Coaching Session',
    };

    const sessionPage: SessionPage = {
      date: '2025-08-08',
      time: '10:00:00',
      duration: 30,
      host: mockHost,
      user: mockUser,
      service: mockService,
    };

    return of(sessionPage);
  }

  /**
   * Mock implementation of getAvailableDateTimes query
   */
  getAvailableDateTimes(userId: string): Observable<DateAvailability[]> {
    // Mock availability data for August 2025
    const availabilities: DateAvailability[] = [
      {
        date: '2025-08-05',
        times: this.getTimeRangesForDate('2025-08-05'),
      },
      {
        date: '2025-08-07',
        times: this.getTimeRangesForDate('2025-08-07'),
      },
      {
        date: '2025-08-08',
        times: this.getTimeRangesForDate('2025-08-08'),
      },
      {
        date: '2025-08-09',
        times: this.getTimeRangesForDate('2025-08-09'),
      },
      {
        date: '2025-08-12',
        times: this.getTimeRangesForDate('2025-08-12'),
      },
      {
        date: '2025-08-14',
        times: this.getTimeRangesForDate('2025-08-14'),
      },
      {
        date: '2025-08-16',
        times: this.getTimeRangesForDate('2025-08-16'),
      },
      {
        date: '2025-08-19',
        times: this.getTimeRangesForDate('2025-08-19'),
      },
      {
        date: '2025-08-21',
        times: this.getTimeRangesForDate('2025-08-21'),
      },
      {
        date: '2025-08-23',
        times: this.getTimeRangesForDate('2025-08-23'),
      },
      {
        date: '2025-08-26',
        times: this.getTimeRangesForDate('2025-08-26'),
      },
      {
        date: '2025-08-28',
        times: this.getTimeRangesForDate('2025-08-28'),
      },
    ];

    return of(availabilities);
  }

  /**
   * Get available time slots for a specific date
   * Matches the exact times shown in the Figma design
   */
  getAvailableTimesForDate(dateString: string): Observable<TimeRange[]> {
    const timeRanges = this.getTimeRangesForDate(dateString);
    return of(timeRanges);
  }

  /**
   * Private method to generate time ranges for a date
   * Returns the exact time slots shown in Figma design
   */
  private getTimeRangesForDate(dateString: string): TimeRange[] {
    // These are the exact times from the Figma design
    const timeSlots = [
      '8:00am',
      '8:30am',
      '9:00am',
      '10:00am',
      '10:15am',
      '10:30am',
      '10:45am',
      '11:30am',
      '1:30pm',
      '2:30pm',
      '2:45pm',
      '3:00pm',
      '3:30pm',
    ];

    return timeSlots.map((time, index) => ({
      start: this.convertToAWSTime(time),
      end: this.convertToAWSTime(this.calculateEndTime(time, 30)),
    }));
  }

  /**
   * Calculate end time based on start time and duration
   */
  private calculateEndTime(startTime: string, durationMinutes: number): string {
    const match = startTime.match(/(\d+):(\d+)(am|pm)/);
    if (!match) return startTime;

    const [, hoursStr, minutesStr, period] = match;
    const hours = parseInt(hoursStr);
    const minutes = parseInt(minutesStr);

    // Convert to 24-hour format
    let hour24 = hours;
    if (period === 'pm' && hours !== 12) {
      hour24 += 12;
    } else if (period === 'am' && hours === 12) {
      hour24 = 0;
    }

    // Add duration
    const totalMinutes = hour24 * 60 + minutes + durationMinutes;
    const endHour24 = Math.floor(totalMinutes / 60);
    const endMinutes = totalMinutes % 60;

    // Convert back to 12-hour format
    let endHour12 = endHour24;
    let endPeriod = 'am';

    if (endHour24 >= 12) {
      endPeriod = 'pm';
      if (endHour24 > 12) {
        endHour12 = endHour24 - 12;
      }
    } else if (endHour24 === 0) {
      endHour12 = 12;
    }

    const endMinutesStr = endMinutes.toString().padStart(2, '0');
    return `${endHour12}:${endMinutesStr}${endPeriod}`;
  }

  /**
   * Convert 12-hour format to AWS Time format (HH:MM:SS)
   */
  private convertToAWSTime(time12: string): string {
    const match = time12.match(/(\d+):(\d+)(am|pm)/);
    if (!match) return '00:00:00';

    const [, hoursStr, minutesStr, period] = match;
    const hours = parseInt(hoursStr);
    const minutes = parseInt(minutesStr);

    // Convert to 24-hour format
    let hour24 = hours;
    if (period === 'pm' && hours !== 12) {
      hour24 += 12;
    } else if (period === 'am' && hours === 12) {
      hour24 = 0;
    }

    return `${hour24.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:00`;
  }
}
