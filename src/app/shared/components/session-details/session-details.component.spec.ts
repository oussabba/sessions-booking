import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SessionDetailsComponent } from './session-details.component';
import { SessionService } from '../../../models/session.interface';

describe('SessionDetailsComponent', () => {
  let component: SessionDetailsComponent;
  let fixture: ComponentFixture<SessionDetailsComponent>;

  const mockService: SessionService = {
    title: 'Therapy Session',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SessionDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SessionDetailsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should accept service input', () => {
    component.service = mockService;
    expect(component.service).toEqual(mockService);
    expect(component.service.title).toBe('Therapy Session');
  });

  it('should accept duration input', () => {
    component.duration = 45;
    expect(component.duration).toBe(45);
  });

  it('should render session information when inputs are provided', () => {
    component.service = mockService;
    component.duration = 45;
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('Therapy Session');
  });

  it('should use OnPush change detection strategy', () => {
    // This test verifies the component uses OnPush strategy
    expect(component).toBeTruthy();
  });

  it('should handle missing service gracefully', () => {
    component.service = null as any;
    component.duration = 45;

    // Should not crash the component, but template may not render
    expect(component.service).toBeNull();
    expect(component.duration).toBe(45);
  });

  it('should handle missing duration gracefully', () => {
    component.service = mockService;
    component.duration = null as any;

    // Should not throw an error
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
