import { TestBed } from '@angular/core/testing';
import { SessionBookingService } from './session-booking.service';
import { Apollo } from 'apollo-angular';

// Mock Apollo to avoid GraphQL complexities in testing
const mockApollo = {
  query: jasmine.createSpy('query'),
};

describe('SessionBookingService', () => {
  let service: SessionBookingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SessionBookingService,
        { provide: Apollo, useValue: mockApollo },
      ],
    });
    service = TestBed.inject(SessionBookingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have getSessionPage method', () => {
    expect(service.getSessionPage).toBeDefined();
    expect(typeof service.getSessionPage).toBe('function');
  });

  it('should have getAvailableDateTimes method', () => {
    expect(service.getAvailableDateTimes).toBeDefined();
    expect(typeof service.getAvailableDateTimes).toBe('function');
  });

  it('should have getAvailableTimesForDate method', () => {
    expect(service.getAvailableTimesForDate).toBeDefined();
    expect(typeof service.getAvailableTimesForDate).toBe('function');
  });

  it('should have convertTo12HourFormat method', () => {
    expect(service.convertTo12HourFormat).toBeDefined();
    expect(typeof service.convertTo12HourFormat).toBe('function');
  });

  describe('convertTo12HourFormat', () => {
    it('should convert 24-hour format to 12-hour format correctly', () => {
      expect(service.convertTo12HourFormat('08:00')).toBe('8:00am');
      expect(service.convertTo12HourFormat('13:30')).toBe('1:30pm');
      expect(service.convertTo12HourFormat('00:00')).toBe('12:00am');
      expect(service.convertTo12HourFormat('12:00')).toBe('12:00pm');
    });
  });
});
