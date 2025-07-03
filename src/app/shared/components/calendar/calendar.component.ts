import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  DateAvailability,
  CalendarDate,
  CalendarMonth,
} from '../../../models/session.interface';

@Component({
  selector: 'app-calendar',
  imports: [CommonModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarComponent implements OnInit, OnChanges {
  @Input() availabilities: DateAvailability[] = [];
  @Input() selectedDate?: string;
  @Input() timeZone?: string;
  @Output() dateSelected = new EventEmitter<string>();

  currentMonth!: CalendarMonth;
  weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  monthNames = [
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

  ngOnInit() {
    this.initializeCalendar();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['availabilities'] || changes['selectedDate']) {
      this.updateCalendarDates();
    }
  }

  private initializeCalendar() {
    // Start with August 2025 as shown in the design
    const today = new Date();
    const targetMonth = 7; // August (0-indexed)
    const targetYear = 2025;

    this.currentMonth = this.generateMonth(targetYear, targetMonth);
  }

  private generateMonth(year: number, month: number): CalendarMonth {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay()); // Start from Sunday

    const dates: CalendarDate[] = [];
    const currentDate = new Date(startDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Generate 6 weeks (42 days) to fill the calendar grid
    for (let i = 0; i < 42; i++) {
      const dateString = this.formatDate(currentDate);
      const isCurrentMonth = currentDate.getMonth() === month;
      const isPastDate = currentDate < today;
      const isAvailable = this.isDateAvailable(dateString);
      const isSelected = this.selectedDate === dateString;

      dates.push({
        day: currentDate.getDate(),
        date: dateString,
        isAvailable: isAvailable && isCurrentMonth && !isPastDate,
        isSelected: isSelected,
        isCurrentMonth: isCurrentMonth,
        isPastDate: isPastDate,
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return {
      year: year,
      month: month,
      monthName: this.monthNames[month],
      dates: dates,
    };
  }

  private updateCalendarDates() {
    if (this.currentMonth) {
      this.currentMonth = this.generateMonth(
        this.currentMonth.year,
        this.currentMonth.month
      );
    }
  }

  private isDateAvailable(dateString: string): boolean {
    return this.availabilities.some(
      (availability) => availability.date === dateString
    );
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  onDateClick(date: CalendarDate) {
    if (date.isAvailable && !date.isPastDate) {
      this.dateSelected.emit(date.date);
    }
  }

  previousMonth() {
    let newMonth = this.currentMonth.month - 1;
    let newYear = this.currentMonth.year;

    if (newMonth < 0) {
      newMonth = 11;
      newYear--;
    }

    this.currentMonth = this.generateMonth(newYear, newMonth);
  }

  nextMonth() {
    let newMonth = this.currentMonth.month + 1;
    let newYear = this.currentMonth.year;

    if (newMonth > 11) {
      newMonth = 0;
      newYear++;
    }

    this.currentMonth = this.generateMonth(newYear, newMonth);
  }

  getCurrentMonthYear(): string {
    return `${this.currentMonth.monthName} ${this.currentMonth.year}`;
  }
}
