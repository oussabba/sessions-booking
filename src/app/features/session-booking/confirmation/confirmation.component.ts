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
import { Observable } from 'rxjs';

import { SessionBookingService } from '../../../core/services/session-booking.service';
import { HostProfileComponent } from '../../../shared/components/host-profile/host-profile.component';
import { SessionDetailsComponent } from '../../../shared/components/session-details/session-details.component';
import { SessionPage, TimeRange } from '../../../models/session.interface';

@Component({
  selector: 'app-confirmation',
  standalone: true,
  imports: [CommonModule, HostProfileComponent, SessionDetailsComponent],
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

  constructor(
    private sessionBookingService: SessionBookingService,
    private cdr: ChangeDetectorRef
  ) {
    this.sessionData$ = this.sessionBookingService.getSessionPage('session-1');
  }

  ngOnInit(): void {
    // TODO: Get selected date and time from state management/router
    // For now, using mock data to match Figma
    this.selectedDate = '2025-08-08';
    this.selectedTime = { start: '08:00:00', end: '08:30:00' };
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

  getUserInfo(): string {
    // TODO: Get from actual user state
    return 'John Smith\njohn.smith@vibly.io';
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
