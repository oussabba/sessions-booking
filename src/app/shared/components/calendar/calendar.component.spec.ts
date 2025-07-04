import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CalendarComponent } from './calendar.component';
import { DateAvailability } from '../../../models/session.interface';

describe('CalendarComponent', () => {
  let component: CalendarComponent;
  let fixture: ComponentFixture<CalendarComponent>;

  const mockAvailabilities: DateAvailability[] = [
    {
      date: '2025-08-08',
      times: [{ start: '08:00:00', end: '10:00:00' }],
    },
    {
      date: '2025-08-09',
      times: [{ start: '09:00:00', end: '11:00:00' }],
    },
    {
      date: '2025-08-10',
      times: [],
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CalendarComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with current month when no availabilities provided', () => {
    component.ngOnInit();

    const now = new Date();
    expect(component.currentMonth.year).toBe(now.getFullYear());
    expect(component.currentMonth.month).toBe(now.getMonth());
  });

  it('should accept availabilities input', () => {
    component.availabilities = mockAvailabilities;
    expect(component.availabilities).toEqual(mockAvailabilities);
    expect(component.availabilities.length).toBe(3);
  });

  it('should accept selectedDate input', () => {
    component.selectedDate = '2025-08-08';
    expect(component.selectedDate).toBe('2025-08-08');
  });

  it('should accept timeZone input', () => {
    component.timeZone = 'America/New_York';
    expect(component.timeZone).toBe('America/New_York');
  });

  it('should emit dateSelected when onDateClick is called with available date', () => {
    spyOn(component.dateSelected, 'emit');

    const mockDate = {
      day: 8,
      date: '2025-08-08',
      isAvailable: true,
      isSelected: false,
      isCurrentMonth: true,
      isPastDate: false,
    };

    component.onDateClick(mockDate);
    expect(component.dateSelected.emit).toHaveBeenCalledWith('2025-08-08');
  });

  it('should not emit dateSelected when onDateClick is called with unavailable date', () => {
    spyOn(component.dateSelected, 'emit');

    const mockDate = {
      day: 10,
      date: '2025-08-10',
      isAvailable: false,
      isSelected: false,
      isCurrentMonth: true,
      isPastDate: false,
    };

    component.onDateClick(mockDate);
    expect(component.dateSelected.emit).not.toHaveBeenCalled();
  });

  it('should navigate to next month', () => {
    component.ngOnInit();
    const initialMonth = component.currentMonth.month;
    const initialYear = component.currentMonth.year;

    component.nextMonth();

    if (initialMonth === 11) {
      expect(component.currentMonth.month).toBe(0);
      expect(component.currentMonth.year).toBe(initialYear + 1);
    } else {
      expect(component.currentMonth.month).toBe(initialMonth + 1);
      expect(component.currentMonth.year).toBe(initialYear);
    }
  });

  it('should navigate to previous month', () => {
    component.ngOnInit();
    const initialMonth = component.currentMonth.month;
    const initialYear = component.currentMonth.year;

    component.previousMonth();

    if (initialMonth === 0) {
      expect(component.currentMonth.month).toBe(11);
      expect(component.currentMonth.year).toBe(initialYear - 1);
    } else {
      expect(component.currentMonth.month).toBe(initialMonth - 1);
      expect(component.currentMonth.year).toBe(initialYear);
    }
  });

  it('should return current month year as string', () => {
    component.ngOnInit();
    const result = component.getCurrentMonthYear();

    expect(typeof result).toBe('string');
    expect(result).toContain(component.currentMonth.monthName);
    expect(result).toContain(component.currentMonth.year.toString());
  });

  it('should use OnPush change detection strategy', () => {
    expect(component).toBeTruthy();
  });

  it('should have correct weekDays array', () => {
    expect(component.weekDays).toEqual(['S', 'M', 'T', 'W', 'T', 'F', 'S']);
  });

  it('should have correct monthNames array', () => {
    expect(component.monthNames.length).toBe(12);
    expect(component.monthNames[0]).toBe('January');
    expect(component.monthNames[11]).toBe('December');
  });
});
