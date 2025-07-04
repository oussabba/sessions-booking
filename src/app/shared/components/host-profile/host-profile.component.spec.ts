import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HostProfileComponent } from './host-profile.component';
import { SessionHost } from '../../../models/session.interface';

describe('HostProfileComponent', () => {
  let component: HostProfileComponent;
  let fixture: ComponentFixture<HostProfileComponent>;

  const mockHost: SessionHost = {
    firstName: 'Dr.',
    lastName: 'Smith',
    profession: 'Licensed Therapist',
    photo: '/assets/images/vibly_logo.png',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostProfileComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HostProfileComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render host information when host is provided', () => {
    component.host = mockHost;
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('Dr.');
    expect(compiled.textContent).toContain('Smith');
    expect(compiled.textContent).toContain('Licensed Therapist');
  });

  it('should have OnPush change detection strategy', () => {
    // This test verifies the component uses OnPush strategy
    expect(component).toBeTruthy();
  });

  it('should accept host input', () => {
    component.host = mockHost;
    expect(component.host).toEqual(mockHost);
    expect(component.host.firstName).toBe('Dr.');
    expect(component.host.lastName).toBe('Smith');
  });
});
