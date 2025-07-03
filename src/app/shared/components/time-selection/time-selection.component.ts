import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeRange } from '../../../models/session.interface';

@Component({
  selector: 'app-time-selection',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './time-selection.component.html',
  styleUrls: ['./time-selection.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimeSelectionComponent {
  @Input() selectedDate?: string; // YYYY-MM-DD format
  @Input() availableTimes: TimeRange[] = [];
  @Input() selectedTime?: TimeRange;
  @Input() isMobile = false;
  @Output() timeSelected = new EventEmitter<TimeRange>();

  onTimeClick(time: TimeRange): void {
    this.timeSelected.emit(time);
  }

  getSelectedDateDisplay(): string {
    if (!this.selectedDate) return '';

    const date = new Date(this.selectedDate);
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    };

    return date.toLocaleDateString('en-US', options);
  }

  /**
   * Convert AWS Time format (HH:MM:SS) to display format (h:mmam/pm)
   */
  getDisplayTime(awsTime: string): string {
    const [hours, minutes] = awsTime.split(':').map(Number);
    const period = hours >= 12 ? 'pm' : 'am';
    const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    const displayMinutes =
      minutes > 0 ? `:${minutes.toString().padStart(2, '0')}` : '';

    return `${displayHours}${displayMinutes}${period}`;
  }
}
