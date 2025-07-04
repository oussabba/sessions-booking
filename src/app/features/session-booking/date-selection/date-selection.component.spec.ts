import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DateSelectionComponent } from './date-selection.component';
import { SessionBookingService } from '../../../core/services/session-booking.service';
import { of } from 'rxjs';

// Mock SessionBookingService to avoid GraphQL dependencies
const mockSessionBookingService = {
  getSessionPage: jasmine.createSpy('getSessionPage').and.returnValue(
    of({
      date: '2025-08-08',
      time: '10:00:00',
      duration: 45,
      host: {
        firstName: 'Dr.',
        lastName: 'Smith',
        profession: 'Therapist',
        photo: '/test.png',
      },
      user: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@test.com',
        timeZone: 'America/New_York',
      },
      service: { title: 'Session' },
    })
  ),
  getAvailableDateTimes: jasmine
    .createSpy('getAvailableDateTimes')
    .and.returnValue(
      of([
        { date: '2025-08-08', times: [{ start: '08:00:00', end: '08:30:00' }] },
      ])
    ),
  getAvailableTimesForDate: jasmine
    .createSpy('getAvailableTimesForDate')
    .and.returnValue(of([{ start: '08:00:00', end: '08:30:00' }])),
};

describe('DateSelectionComponent', () => {
  let component: DateSelectionComponent;
  let fixture: ComponentFixture<DateSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DateSelectionComponent],
      providers: [
        { provide: SessionBookingService, useValue: mockSessionBookingService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DateSelectionComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize session data on ngOnInit', () => {
    component.ngOnInit();
    expect(mockSessionBookingService.getSessionPage).toHaveBeenCalled();
  });

  it('should load available date times on ngOnInit', () => {
    component.ngOnInit();
    expect(mockSessionBookingService.getAvailableDateTimes).toHaveBeenCalled();
  });

  it('should have initial state properties', () => {
    expect(component.sessionData$).toBeDefined();
    expect(component.availabilities$).toBeDefined();
    expect(component.selectedDate).toBeUndefined();
    expect(component.availableTimesForSelectedDate).toEqual([]);
  });

  it('should have mobile navigation state', () => {
    expect(component.showingTimeSelection).toBe(false);
    expect(typeof component.onBackToDateSelection).toBe('function');
  });
});
