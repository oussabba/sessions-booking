import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { DateSelectionComponent } from './features/session-booking/date-selection/date-selection.component';
import { ConfirmationComponent } from './features/session-booking/confirmation/confirmation.component';
import { CompletionComponent } from './features/session-booking/completion/completion.component';
import { TimeRange } from './models/session.interface';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    CommonModule,
    DateSelectionComponent,
    ConfirmationComponent,
    CompletionComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'vibly-challenge';
  currentStep: 'date-selection' | 'confirmation' | 'completion' =
    'date-selection';

  selectedDate?: string;
  selectedTime?: TimeRange;

  onDateTimeSelected(event: { date: string; time: TimeRange }): void {
    this.selectedDate = event.date;
    this.selectedTime = event.time;
    this.currentStep = 'confirmation';
  }

  onBackToDateSelection(): void {
    this.currentStep = 'date-selection';
  }

  onConfirmationCompleted(): void {
    this.currentStep = 'completion';
  }
}
