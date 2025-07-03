import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

import { SessionBookingService } from '../../../core/services/session-booking.service';
import { HostProfileComponent } from '../../../shared/components/host-profile/host-profile.component';
import { SessionDetailsComponent } from '../../../shared/components/session-details/session-details.component';
import { CalendarComponent } from '../../../shared/components/calendar/calendar.component';
import { TimeSelectionComponent } from '../../../shared/components/time-selection/time-selection.component';
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

  selectedDate?: string;
  selectedTime?: TimeRange;
  availableTimesForSelectedDate: TimeRange[] = [];

  // Mobile navigation state
  showingTimeSelection = false;

  constructor(
    private sessionBookingService: SessionBookingService,
    private cdr: ChangeDetectorRef
  ) {
    this.sessionData$ = this.sessionBookingService.getSessionPage('session-1');
    this.availabilities$ =
      this.sessionBookingService.getAvailableDateTimes('user-1');
  }

  ngOnInit(): void {
    // Component initialization
  }

  onDateSelected(date: string): void {
    this.selectedDate = date;
    this.selectedTime = undefined; // Reset selected time when date changes

    // Get available times for the selected date
    this.sessionBookingService
      .getAvailableTimesForDate(date)
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
