import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-session-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './session-header.component.html',
  styleUrls: ['./session-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SessionHeaderComponent {
  @Input() title: string = 'Schedule session';
}
