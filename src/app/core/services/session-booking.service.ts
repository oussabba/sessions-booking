import { Injectable } from '@angular/core';
import { Observable, map, catchError } from 'rxjs';
import { Apollo } from 'apollo-angular';
import {
  SessionPage,
  DateAvailability,
  TimeRange,
} from '../../models/session.interface';
import { GET_SESSION_PAGE, GET_AVAILABLE_DATE_TIMES } from './graphql-queries';

@Injectable({
  providedIn: 'root',
})
export class SessionBookingService {
  constructor(private apollo: Apollo) {}

  /**
   * Get session page data from GraphQL API
   */
  getSessionPage(id: string): Observable<SessionPage> {
    return this.apollo
      .query<{ getSessionPage: any }>({
        query: GET_SESSION_PAGE,
        variables: { id },
      })
      .pipe(
        map((result) => {
          const data = result.data.getSessionPage;

          // Transform GraphQL response to our interface
          const sessionPage: SessionPage = {
            date: data.date,
            time: data.time,
            duration: data.duration,
            host: {
              firstName: data.host.firstName,
              lastName: data.host.lastName,
              profession: data.host.profession,
              photo: data.host.photo,
            },
            user: {
              firstName: data.user.firstName,
              lastName: data.user.lastName,
              email: data.user.email,
              timeZone: data.user.timeZone,
            },
            service: {
              title: data.service.title,
            },
          };

          return sessionPage;
        }),
        catchError((error) => {
          console.error('Error fetching session page:', error);
          throw error;
        })
      );
  }

  /**
   * Get available date times from GraphQL API
   */
  getAvailableDateTimes(userId: string): Observable<DateAvailability[]> {
    return this.apollo
      .query<{ getAvailableDateTimes: any[] }>({
        query: GET_AVAILABLE_DATE_TIMES,
        variables: { userId },
      })
      .pipe(
        map((result) => {
          const data = result.data.getAvailableDateTimes;

          // Transform GraphQL response to our interface
          // Generate individual 30-minute slots from time ranges
          const transformedData = data.map((item) => ({
            date: item.date,
            times: this.generateTimeSlotsFromRanges(item.times || []),
          }));

          return transformedData;
        }),
        catchError((error) => {
          console.error('Service: Error fetching available date times:', error);
          throw error;
        })
      );
  }

  /**
   * Generate individual 30-minute time slots from time ranges
   */
  private generateTimeSlotsFromRanges(timeRanges: any[]): TimeRange[] {
    const timeSlots: TimeRange[] = [];

    timeRanges.forEach((range) => {
      const startTime = range.start; // e.g., "10:00:00"
      const endTime = range.end; // e.g., "12:00:00"

      // Generate 30-minute slots within this range
      const slots = this.generateSlotsInRange(startTime, endTime);
      timeSlots.push(...slots);
    });

    return timeSlots;
  }

  /**
   * Generate 30-minute slots within a time range
   */
  private generateSlotsInRange(
    startTime: string,
    endTime: string
  ): TimeRange[] {
    const slots: TimeRange[] = [];

    // Parse start and end times
    const start = this.parseTime(startTime);
    const end = this.parseTime(endTime);

    // Generate 30-minute slots
    let current = start;
    while (current < end) {
      const slotStart = this.formatTime(current);
      const slotEnd = this.formatTime(current + 30); // Add 30 minutes

      slots.push({
        start: slotStart,
        end: slotEnd,
      });

      current += 30; // Move to next 30-minute slot
    }

    return slots;
  }

  /**
   * Parse time string (HH:MM:SS) to minutes since midnight
   */
  private parseTime(timeString: string): number {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
  }

  /**
   * Format minutes since midnight back to HH:MM:SS
   */
  private formatTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins
      .toString()
      .padStart(2, '0')}:00`;
  }

  /**
   * Convert 24-hour format time to 12-hour format for display
   */
  convertTo12HourFormat(time24: string): string {
    const [hours, minutes] = time24.split(':').map(Number);

    let period = 'am';
    let displayHours = hours;

    if (hours >= 12) {
      period = 'pm';
      if (hours > 12) {
        displayHours = hours - 12;
      }
    } else if (hours === 0) {
      displayHours = 12;
    }

    const displayMinutes =
      minutes === 0 ? '00' : minutes.toString().padStart(2, '0');
    return `${displayHours}:${displayMinutes}${period}`;
  }

  /**
   * Get available time slots for a specific date
   * This will filter the available times for the specific date
   */
  getAvailableTimesForDate(dateString: string): Observable<TimeRange[]> {
    // Using default userId in UUID format - in a real app, this would come from auth
    const defaultUserId = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';

    return this.getAvailableDateTimes(defaultUserId).pipe(
      map((availabilities) => {
        const dateAvailability = availabilities.find(
          (avail) => avail.date === dateString
        );
        return dateAvailability?.times || [];
      })
    );
  }
}
