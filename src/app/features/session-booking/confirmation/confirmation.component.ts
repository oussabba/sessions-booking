import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, map, combineLatest } from 'rxjs';

import { SessionBookingService } from '../../../core/services/session-booking.service';
import { HostProfileComponent } from '../../../shared/components/host-profile/host-profile.component';
import { SessionDetailsComponent } from '../../../shared/components/session-details/session-details.component';
import { UserProfileComponent } from '../../../shared/components/user-profile/user-profile.component';
import { SessionPage, TimeRange } from '../../../models/session.interface';

@Component({
  selector: 'app-confirmation',
  standalone: true,
  imports: [
    CommonModule,
    HostProfileComponent,
    SessionDetailsComponent,
    UserProfileComponent,
  ],
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmationComponent implements OnInit {
  @Input() selectedDate?: string;
  @Input() selectedTime?: TimeRange;
  @Output() backRequested = new EventEmitter<void>();
  @Output() confirmationCompleted = new EventEmitter<void>();

  sessionData$: Observable<SessionPage>;
  combinedData$!: Observable<{
    sessionData: SessionPage;
    formattedDateTime: string;
    userInfo: string;
  }>;

  constructor(
    private sessionBookingService: SessionBookingService,
    private cdr: ChangeDetectorRef
  ) {
    this.sessionData$ = this.sessionBookingService.getSessionPage(
      'f47ac10b-58cc-4372-a567-0e02b2c3d479'
    );
  }

  ngOnInit(): void {
    // For demo purposes, set default values if no selection provided
    if (!this.selectedDate || !this.selectedTime) {
      this.selectedDate = '2025-08-08';
      this.selectedTime = { start: '08:00:00', end: '08:30:00' };
    }

    // Combine session data with formatted date/time and user info
    this.combinedData$ = this.sessionData$.pipe(
      map((sessionData) => ({
        sessionData,
        formattedDateTime: this.getFormattedDateTimeWithData(sessionData),
        userInfo: this.getUserInfoWithData(sessionData),
      }))
    );
  }

  getFormattedDateTime(): string {
    if (!this.selectedDate || !this.selectedTime) return '';

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

    const startTime = this.formatTime(this.selectedTime.start);
    const endTime = this.formatTime(this.selectedTime.end);

    return `${weekday}, ${day} ${month} ${year}\n${startTime} - ${endTime} (EET)\nEastern European Time (11:04)`;
  }

  getFormattedDateTimeWithData(sessionData: SessionPage): string {
    if (!this.selectedDate || !this.selectedTime) return '';

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

    const startTime = this.formatTime(this.selectedTime.start);
    const endTime = this.formatTime(this.selectedTime.end);

    // Use timezone from session data
    const timeZone = sessionData.user.timeZone || 'Eastern European Time';
    const timeZoneAbbr = this.getTimeZoneAbbreviation(timeZone);

    return `${weekday}, ${day} ${month} ${year}\n${startTime} - ${endTime} (${timeZoneAbbr})\n${timeZone} (11:04)`;
  }

  getUserInfo(): string {
    return 'John Smith\njohn.smith@vibly.io';
  }

  getUserInfoWithData(sessionData: SessionPage): string {
    const fullName = `${sessionData.user.firstName} ${sessionData.user.lastName}`;
    const email = sessionData.user.email;
    return `${fullName}\n${email}`;
  }

  private getTimeZoneAbbreviation(timeZone: string): string {
    // Map common timezone names to abbreviations
    const abbreviations: { [key: string]: string } = {
      'Eastern European Time': 'EET',
      'Central European Time': 'CET',
      'Greenwich Mean Time': 'GMT',
      'Pacific Standard Time': 'PST',
      'Eastern Standard Time': 'EST',
      // Add more as needed
    };

    return abbreviations[timeZone] || 'UTC';
  }

  getPreWhiteSpace(text: string): string {
    return text.replace(/\n/g, '\n');
  }

  private formatTime(timeString: string): string {
    const [hours, minutes] = timeString.split(':').map(Number);
    const period = hours >= 12 ? 'pm' : 'am';
    const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    const displayMinutes =
      minutes > 0 ? `:${minutes.toString().padStart(2, '0')}` : '';

    return `${displayHours}${displayMinutes}${period}`;
  }

  onBackClick(): void {
    this.backRequested.emit();
  }

  onConfirmClick(): void {
    this.confirmationCompleted.emit();
  }

  isMobile(): boolean {
    return window.innerWidth <= 768;
  }

  getFormattedDate(): string {
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

  getFormattedTime(): string {
    if (!this.selectedTime) return '';
    return `${this.selectedTime.start} - ${this.selectedTime.end} (EET)`;
  }
}
