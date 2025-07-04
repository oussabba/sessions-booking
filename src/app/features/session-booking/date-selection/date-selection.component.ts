import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { map, startWith, catchError, finalize } from 'rxjs/operators';

import { SessionBookingService } from '../../../core/services/session-booking.service';
import { HostProfileComponent } from '../../../shared/components/host-profile/host-profile.component';
import { SessionDetailsComponent } from '../../../shared/components/session-details/session-details.component';
import { CalendarComponent } from '../../../shared/components/calendar/calendar.component';
import { TimeSelectionComponent } from '../../../shared/components/time-selection/time-selection.component';
import { SessionHeaderComponent } from '../../../shared/components/session-header/session-header.component';
import {
  SessionPage,
  DateAvailability,
  TimeRange,
} from '../../../models/session.interface';

@Component({
  selector: 'app-date-selection',
  standalone: true,
  imports: [
    CommonModule,
    HostProfileComponent,
    SessionDetailsComponent,
    CalendarComponent,
    TimeSelectionComponent,
    SessionHeaderComponent,
  ],
  templateUrl: './date-selection.component.html',
  styleUrls: ['./date-selection.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DateSelectionComponent implements OnInit {
  @Output() stepCompleted = new EventEmitter<{
    date: string;
    time: TimeRange;
  }>();

  sessionData$: Observable<SessionPage>;
  availabilities$: Observable<DateAvailability[]>;

  // Loading states
  private loadingSubject = new BehaviorSubject<boolean>(true);
  private timesLoadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();
  timesLoading$ = this.timesLoadingSubject.asObservable();

  // Error states
  private errorSubject = new BehaviorSubject<string | null>(null);
  error$ = this.errorSubject.asObservable();

  selectedDate?: string;
  selectedTime?: TimeRange;
  availableTimesForSelectedDate: TimeRange[] = [];

  // Mobile navigation state
  showingTimeSelection = false;

  constructor(
    private sessionBookingService: SessionBookingService,
    private cdr: ChangeDetectorRef
  ) {
    // Initialize GraphQL data streams with loading/error handling
    this.sessionData$ = this.sessionBookingService
      .getSessionPage('f47ac10b-58cc-4372-a567-0e02b2c3d479')
      .pipe(
        catchError((error) => {
          console.error('Error loading session data:', error);
          this.errorSubject.next(
            'Failed to load session information. Using default data.'
          );
          throw error;
        })
      );

    this.availabilities$ = this.sessionBookingService
      .getAvailableDateTimes('a1b2c3d4-e5f6-7890-abcd-ef1234567890')
      .pipe(
        catchError((error) => {
          console.error('Error loading availabilities:', error);
          this.errorSubject.next(
            'Failed to load available dates. Using default data.'
          );
          throw error;
        }),
        finalize(() => {
          this.loadingSubject.next(false);
          this.cdr.markForCheck();
        })
      );
  }

  ngOnInit(): void {
    // Set up combined loading state
    combineLatest([this.sessionData$, this.availabilities$])
      .pipe(
        map(() => false), // Data loaded
        startWith(true), // Start with loading
        catchError(() => {
          this.loadingSubject.next(false);
          return [false];
        })
      )
      .subscribe((loading) => {
        this.loadingSubject.next(loading);
        this.cdr.markForCheck();
      });
  }

  onDateSelected(date: string): void {
    this.selectedDate = date;
    this.selectedTime = undefined; // Reset selected time when date changes
    this.timesLoadingSubject.next(true);

    // Get available times for the selected date
    this.sessionBookingService
      .getAvailableTimesForDate(date)
      .pipe(
        catchError((error) => {
          console.error('Error loading times for date:', error);
          this.errorSubject.next(
            'Failed to load available times for selected date.'
          );
          return [];
        }),
        finalize(() => {
          this.timesLoadingSubject.next(false);
          this.cdr.markForCheck();
        })
      )
      .subscribe((times) => {
        this.availableTimesForSelectedDate = times;
        this.cdr.markForCheck();
      });

    // On mobile, navigate to time selection after date is selected
    if (this.isMobile()) {
      this.showingTimeSelection = true;
      this.cdr.markForCheck();
    }
  }

  onTimeSelected(time: TimeRange): void {
    this.selectedTime = time;
    this.cdr.markForCheck();

    // Emit the completed step with selected date and time
    if (this.selectedDate) {
      this.stepCompleted.emit({
        date: this.selectedDate,
        time: time,
      });
    }
  }

  // Mobile navigation methods
  onBackToDateSelection(): void {
    this.showingTimeSelection = false;
    this.cdr.markForCheck();
  }

  onDismissError(): void {
    this.errorSubject.next(null);
    this.cdr.markForCheck();
  }

  getFormattedSelectedDate(): string {
    if (!this.selectedDate) return '';

    const date = new Date(this.selectedDate);
    const weekdays = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    const weekday = weekdays[date.getDay()];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${weekday}, ${day} ${month} ${year}`;
  }

  private isMobile(): boolean {
    return window.innerWidth <= 768;
  }
}
