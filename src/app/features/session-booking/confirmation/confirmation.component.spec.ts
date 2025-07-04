import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectorRef } from '@angular/core';
import { of } from 'rxjs';
import { Apollo } from 'apollo-angular';

import { ConfirmationComponent } from './confirmation.component';
import { SessionBookingService } from '../../../core/services/session-booking.service';

describe('ConfirmationComponent', () => {
  let component: ConfirmationComponent;
  let fixture: ComponentFixture<ConfirmationComponent>;
  let mockSessionBookingService: jasmine.SpyObj<SessionBookingService>;
  let mockApollo: jasmine.SpyObj<Apollo>;

  const mockSessionData = {
    id: 'test-session',
    host: {
      id: 'host-123',
      firstName: 'John',
      lastName: 'Doe',
      profilePicture: 'profile.jpg',
      jobTitle: 'Developer',
      company: 'TechCorp',
    },
    service: {
      id: 'service-123',
      title: 'Test Service',
      description: 'A test service',
    },
    user: {
      id: 'user-123',
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      timeZone: 'Eastern European Time',
    },
  };

  beforeEach(async () => {
    const sessionBookingServiceSpy = jasmine.createSpyObj(
      'SessionBookingService',
      ['getSessionPage']
    );
    const apolloSpy = jasmine.createSpyObj('Apollo', [
      'watchQuery',
      'query',
      'mutate',
    ]);

    sessionBookingServiceSpy.getSessionPage.and.returnValue(
      of(mockSessionData)
    );

    await TestBed.configureTestingModule({
      imports: [ConfirmationComponent],
      providers: [
        { provide: SessionBookingService, useValue: sessionBookingServiceSpy },
        { provide: Apollo, useValue: apolloSpy },
        ChangeDetectorRef,
      ],
    }).compileComponents();

    mockSessionBookingService = TestBed.inject(
      SessionBookingService
    ) as jasmine.SpyObj<SessionBookingService>;
    mockApollo = TestBed.inject(Apollo) as jasmine.SpyObj<Apollo>;
    fixture = TestBed.createComponent(ConfirmationComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should format date and time correctly', () => {
    component.selectedDate = '2025-08-08';
    component.selectedTime = { start: '08:00:00', end: '08:30:00' };

    const formatted = component.getFormattedDateTime();
    expect(formatted).toContain('Friday, 8 August 2025');
    expect(formatted).toContain('8am - 8:30am');
  });

  it('should emit back event when back button clicked', () => {
    spyOn(component.backRequested, 'emit');
    component.onBackClick();
    expect(component.backRequested.emit).toHaveBeenCalled();
  });

  it('should emit confirmation event when confirm button clicked', () => {
    spyOn(component.confirmationCompleted, 'emit');
    component.onConfirmClick();
    expect(component.confirmationCompleted.emit).toHaveBeenCalled();
  });
});
