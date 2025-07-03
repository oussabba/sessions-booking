import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { SessionService } from '../../../models/session.interface';

@Component({
  selector: 'app-session-details',
  imports: [],
  templateUrl: './session-details.component.html',
  styleUrl: './session-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SessionDetailsComponent {
  @Input() service!: SessionService;
  @Input() duration!: number;
}
