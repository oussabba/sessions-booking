# Testing Guide - Vibly Session Booking

This guide explains how to run and work with tests in the Vibly session booking application using Jasmine and Karma.

## Testing Stack

- **Jasmine**: JavaScript testing framework for writing test specs
- **Karma**: Test runner that executes tests in real browsers
- **Angular Testing Utilities**: Angular-specific testing helpers
- **Chrome Headless**: Default browser for CI testing

## Test Commands

### Development Testing

```bash
# Run tests with file watching (for development)
npm run test:watch

# Run tests once without watching
npm test

# Run single test run (no watch mode)
npm run test:single-run
```

### CI/Production Testing

```bash
# Run tests in headless Chrome (for CI)
npm run test:ci

# Run tests with coverage report
npm run test:coverage
```

## Test Structure

### Component Tests

Component tests verify:

- Component creation and initialization
- Input/Output behavior
- Template rendering
- User interactions

Example:

```typescript
describe("HostProfileComponent", () => {
  let component: HostProfileComponent;
  let fixture: ComponentFixture<HostProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostProfileComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HostProfileComponent);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
```

### Service Tests

Service tests verify:

- Service instantiation
- Method functionality
- Data transformation
- Error handling

Example:

```typescript
describe("SessionBookingService", () => {
  let service: SessionBookingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SessionBookingService],
    });
    service = TestBed.inject(SessionBookingService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
```

## Test Files Location

Test files are located alongside their source files with `.spec.ts` extension:

```
src/
├── app/
│   ├── app.component.spec.ts
│   ├── core/
│   │   └── services/
│   │       └── session-booking.service.spec.ts
│   └── shared/
│       └── components/
│           └── host-profile/
│               └── host-profile.component.spec.ts
```

## Configuration Files

### karma.conf.js

Main Karma configuration file that defines:

- Test framework (Jasmine)
- Browsers to run tests in
- Code coverage settings
- File patterns to include/exclude

### src/test.ts

Main test entry point that:

- Configures Angular testing environment
- Loads all test files recursively
- Initializes the test runner

### tsconfig.spec.json

TypeScript configuration for tests that:

- Extends main tsconfig.json
- Includes Jasmine types
- Configures test-specific compiler options

## Coverage Reports

When running tests with coverage, reports are generated in:

```
coverage/vibly-challenge/
├── index.html          # Main coverage report
├── lcov.info          # LCOV format for CI tools
└── clover.xml         # Clover format for CI tools
```

Coverage thresholds are set in karma.conf.js:

- Statements: 80%
- Branches: 70%
- Functions: 80%
- Lines: 80%

## Best Practices

### 1. Test Naming

- Use descriptive test names that explain what is being tested
- Follow the pattern: "should [expected behavior] when [condition]"

### 2. Test Organization

- Group related tests using `describe` blocks
- Use `beforeEach` for common setup
- Keep tests focused and independent

### 3. Mocking

- Mock external dependencies using Jasmine spies
- Use Angular testing utilities for component testing
- Create mock objects for complex services

### 4. Component Testing

```typescript
// Test component inputs
component.host = mockHost;
expect(component.host).toEqual(mockHost);

// Test template rendering
fixture.detectChanges();
const compiled = fixture.nativeElement;
expect(compiled.textContent).toContain("Expected Text");

// Test event emissions
spyOn(component.dateSelected, "emit");
component.onDateClick("2025-08-08");
expect(component.dateSelected.emit).toHaveBeenCalledWith("2025-08-08");
```

### 5. Service Testing

```typescript
// Test method existence
expect(service.getSessionPage).toBeDefined();

// Test method behavior
expect(service.convertTo12HourFormat("13:30")).toBe("1:30pm");

// Test with mocked dependencies
const apolloSpy = jasmine.createSpyObj("Apollo", ["query"]);
TestBed.configureTestingModule({
  providers: [{ provide: Apollo, useValue: apolloSpy }],
});
```

## Running Tests in Different Environments

### Local Development

```bash
npm run test:watch
```

Opens Karma test runner in browser with live reload.

### Continuous Integration

```bash
npm run test:ci
```

Runs tests once in headless Chrome, suitable for CI/CD pipelines.

### Coverage Analysis

```bash
npm run test:coverage
```

Generates detailed coverage reports to identify untested code.

## Troubleshooting

### Common Issues

1. **Tests not found**: Ensure test files end with `.spec.ts`
2. **Import errors**: Check that all dependencies are properly imported
3. **Timeout errors**: Increase timeout in karma.conf.js if needed
4. **Browser not found**: Install Chrome/Chromium for headless testing

### Debug Mode

To debug tests in browser:

```bash
npm test
```

Then click "Debug" button in the Karma browser window.

## Future Enhancements

1. **E2E Testing**: Add Cypress or Protractor for end-to-end tests
2. **Visual Regression**: Add visual diff testing for UI components
3. **Performance Testing**: Add performance benchmarks for critical paths
4. **API Testing**: Add integration tests for GraphQL endpoints
