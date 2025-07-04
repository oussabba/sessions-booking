import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  it('should create app component class', () => {
    const component = new AppComponent();
    expect(component).toBeTruthy();
    expect(component.title).toBe('vibly-challenge');
  });

  it('should have title property', () => {
    const component = new AppComponent();
    expect(component.title).toBeDefined();
    expect(typeof component.title).toBe('string');
  });
});
