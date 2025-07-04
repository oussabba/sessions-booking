import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SessionUser } from '../../../models/session.interface';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserProfileComponent {
  @Input() user!: SessionUser;
  @Input() showEmail: boolean = true;

  getUserFullName(): string {
    return `${this.user.firstName} ${this.user.lastName}`;
  }
}
