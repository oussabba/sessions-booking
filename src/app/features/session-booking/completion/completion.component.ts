import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

import { SessionBookingService } from '../../../core/services/session-booking.service';
import { SessionPage } from '../../../models/session.interface';

@Component({
  selector: 'app-completion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './completion.component.html',
  styleUrls: ['./completion.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompletionComponent {
  sessionData$: Observable<SessionPage>;

  constructor(private sessionBookingService: SessionBookingService) {
    this.sessionData$ = this.sessionBookingService.getSessionPage(
      'f47ac10b-58cc-4372-a567-0e02b2c3d479'
    );
  }

  isMobile(): boolean {
    return window.innerWidth <= 768;
  }

  onJoinVibly(): void {
    // TODO: Navigate to Vibly signup/main app
    console.log('Navigating to Vibly platform...');
  }
}
