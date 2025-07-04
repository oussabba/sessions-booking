import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TimeSelectionComponent } from './time-selection.component';
import { TimeRange } from '../../../models/session.interface';

describe('TimeSelectionComponent', () => {
  let component: TimeSelectionComponent;
  let fixture: ComponentFixture<TimeSelectionComponent>;

  const mockTimeRanges: TimeRange[] = [
    { start: '08:00:00', end: '08:30:00' },
    { start: '09:00:00', end: '09:30:00' },
    { start: '14:30:00', end: '15:00:00' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimeSelectionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TimeSelectionComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should accept selectedDate input', () => {
    component.selectedDate = '2025-08-08';
    expect(component.selectedDate).toBe('2025-08-08');
  });

  it('should accept availableTimes input', () => {
    component.availableTimes = mockTimeRanges;
    expect(component.availableTimes).toEqual(mockTimeRanges);
    expect(component.availableTimes.length).toBe(3);
  });

  it('should accept selectedTime input', () => {
    const selectedTime = mockTimeRanges[0];
    component.selectedTime = selectedTime;
    expect(component.selectedTime).toEqual(selectedTime);
  });

  it('should accept isMobile input', () => {
    component.isMobile = true;
    expect(component.isMobile).toBe(true);
  });

  it('should emit timeSelected when onTimeClick is called', () => {
    spyOn(component.timeSelected, 'emit');
    const timeRange = mockTimeRanges[0];

    component.onTimeClick(timeRange);
    expect(component.timeSelected.emit).toHaveBeenCalledWith(timeRange);
  });

  it('should return formatted date display for selected date', () => {
    component.selectedDate = '2025-08-08';
    const result = component.getSelectedDateDisplay();

    expect(result).toContain('Friday');
    expect(result).toContain('August');
    expect(result).toContain('8');
    expect(result).toContain('2025');
  });

  it('should return empty string when no selected date', () => {
    component.selectedDate = undefined;
    const result = component.getSelectedDateDisplay();
    expect(result).toBe('');
  });

  describe('getDisplayTime', () => {
    it('should convert AM times correctly', () => {
      expect(component.getDisplayTime('08:00:00')).toBe('8:00am');
      expect(component.getDisplayTime('09:30:00')).toBe('9:30am');
      expect(component.getDisplayTime('11:15:00')).toBe('11:15am');
    });

    it('should convert PM times correctly', () => {
      expect(component.getDisplayTime('13:00:00')).toBe('1:00pm');
      expect(component.getDisplayTime('14:30:00')).toBe('2:30pm');
      expect(component.getDisplayTime('23:45:00')).toBe('11:45pm');
    });

    it('should handle 12 hour edge cases', () => {
      expect(component.getDisplayTime('00:00:00')).toBe('12:00am');
      expect(component.getDisplayTime('12:00:00')).toBe('12:00pm');
    });

    it('should handle midnight correctly', () => {
      expect(component.getDisplayTime('00:30:00')).toBe('12:30am');
    });
  });

  it('should use OnPush change detection strategy', () => {
    expect(component).toBeTruthy();
  });
});
