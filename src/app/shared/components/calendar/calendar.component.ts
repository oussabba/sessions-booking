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
    // Only initialize with default if no availabilities are provided initially
    if (this.availabilities.length === 0) {
      this.initializeCalendar();
    } else {
      this.initializeCalendarWithApiData();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['availabilities'] && this.availabilities.length > 0) {
      // When API data arrives, initialize calendar to show relevant month
      if (changes['availabilities'].firstChange || !this.currentMonth) {
        this.initializeCalendarWithApiData();
      } else {
        this.updateCalendarDates();
      }
    }

    if (changes['selectedDate']) {
      this.updateCalendarDates();
    }
  }

  private initializeCalendar() {
    // Default initialization - show current month
    const today = new Date();
    this.currentMonth = this.generateMonth(
      today.getFullYear(),
      today.getMonth()
    );
  }

  private initializeCalendarWithApiData() {
    if (this.availabilities.length === 0) {
      this.initializeCalendar();
      return;
    }

    // Sort available dates and show the first month with available dates
    const sortedDates = this.availabilities
      .map((a) => new Date(a.date))
      .sort((a, b) => a.getTime() - b.getTime());

    const firstAvailableDate = sortedDates[0];
    this.currentMonth = this.generateMonth(
      firstAvailableDate.getFullYear(),
      firstAvailableDate.getMonth()
    );
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
      const hasAvailability = this.isDateAvailable(dateString);

      // A date is available if it has availability AND is in current month AND not past
      const isAvailable = hasAvailability && isCurrentMonth && !isPastDate;
      const isSelected = this.selectedDate === dateString;

      dates.push({
        day: currentDate.getDate(),
        date: dateString,
        isAvailable: isAvailable,
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
    // Format date as YYYY-MM-DD in local timezone to match API data
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  onDateClick(date: CalendarDate) {
    // Only allow clicks on available dates
    if (date.isAvailable) {
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
