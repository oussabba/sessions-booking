import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { Apollo } from 'apollo-angular';

import { CompletionComponent } from './completion.component';
import { SessionBookingService } from '../../../core/services/session-booking.service';

describe('CompletionComponent', () => {
  let component: CompletionComponent;
  let fixture: ComponentFixture<CompletionComponent>;
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
      imports: [CompletionComponent],
      providers: [
        { provide: SessionBookingService, useValue: sessionBookingServiceSpy },
        { provide: Apollo, useValue: apolloSpy },
      ],
    }).compileComponents();

    mockSessionBookingService = TestBed.inject(
      SessionBookingService
    ) as jasmine.SpyObj<SessionBookingService>;
    mockApollo = TestBed.inject(Apollo) as jasmine.SpyObj<Apollo>;
    fixture = TestBed.createComponent(CompletionComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should detect mobile correctly', () => {
    // Mock window.innerWidth for mobile
    const spy = spyOnProperty(window, 'innerWidth', 'get').and.returnValue(600);
    expect(component.isMobile()).toBe(true);

    // Change the return value for desktop test
    spy.and.returnValue(1024);
    expect(component.isMobile()).toBe(false);
  });

  it('should open Vibly in new tab when join button clicked', () => {
    spyOn(window, 'open');
    component.onJoinVibly();
    expect(window.open).toHaveBeenCalledWith('https://vibly.io', '_blank');
  });
});
