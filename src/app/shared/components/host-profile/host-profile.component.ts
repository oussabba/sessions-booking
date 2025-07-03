import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { SessionHost } from '../../../models/session.interface';

@Component({
  selector: 'app-host-profile',
  imports: [],
  templateUrl: './host-profile.component.html',
  styleUrl: './host-profile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HostProfileComponent {
  @Input() host!: SessionHost;
}
