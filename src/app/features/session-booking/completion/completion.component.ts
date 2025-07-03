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
    this.sessionData$ = this.sessionBookingService.getSessionPage('session-1');
  }

  isMobile(): boolean {
    return window.innerWidth <= 768;
  }

  onJoinVibly(): void {
    // TODO: Navigate to Vibly signup/main app
    console.log('Navigating to Vibly platform...');
  }
}
