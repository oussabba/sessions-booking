# Vibly Session Booking Challenge

A modern, responsive Angular application for scheduling 1:1 sessions with hosts. Built with Angular 19, TypeScript, and GraphQL integration.

## 🌟 Features

- **4-Step Booking Workflow**: Date selection → Time selection → Confirmation → Completion
- **Responsive Design**: Optimized for both desktop and mobile devices
- **Real-time Availability**: GraphQL-powered session availability checking
- **Modern UI Components**: Reusable Angular standalone components
- **Comprehensive Testing**: Full test suite with Jasmine and Karma
- **TypeScript**: Type-safe development with strict type checking

## 🚀 Technology Stack

### Frontend

- **Angular 19.2.0** - Latest Angular framework
- **TypeScript 5.7.2** - Type-safe JavaScript
- **RxJS 7.8.0** - Reactive programming
- **SCSS** - Enhanced CSS with variables and mixins

### Backend Integration

- **Apollo Angular 11.0.0** - GraphQL client
- **GraphQL 16.11.0** - Query language for APIs

### Testing

- **Jasmine 5.6.0** - Testing framework
- **Karma 6.4.0** - Test runner
- **Angular Testing Utilities** - Component and service testing

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18+ recommended)
- **npm** (v9+ recommended)
- **Angular CLI** (v19.2.14)

```bash
# Install Angular CLI globally
npm install -g @angular/cli
```

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/oussabba/sessions-booking.git
cd sessions-booking
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

The application requires GraphQL API configuration. Follow these steps:

```bash
# Copy template files
cp src/environments/environment.template.ts src/environments/environment.ts
cp src/environments/environment.prod.template.ts src/environments/environment.prod.ts
```

**Update with your credentials:**

Edit `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  graphql: {
    apiUrl: "YOUR_GRAPHQL_API_URL_HERE",
    apiKey: "YOUR_API_KEY_HERE",
  },
};
```

Edit `src/environments/environment.prod.ts` with production credentials.

### 4. Start Development Server

```bash
npm start
# or
ng serve
```

Navigate to `http://localhost:4200`. The application will automatically reload when you change source files.

## 🧪 Testing

### Running Tests

The project includes comprehensive test coverage with multiple testing commands:

```bash
# Run tests in interactive mode
npm test

# Run tests in watch mode (development)
npm run test:watch

# Run tests once (CI mode)
npm run test:ci

# Run tests with coverage report
npm run test:coverage
```

### Test Structure

```
src/
├── app/
│   ├── **/*.spec.ts                    # Component tests
│   ├── core/services/*.spec.ts         # Service tests
│   └── shared/components/*.spec.ts     # Shared component tests
├── test.ts                             # Test configuration
└── karma.conf.js                       # Karma configuration
```

## 🏗️ Project Structure

```
sessions-booking/
├── src/
│   ├── app/
│   │   ├── core/
│   │   │   └── services/               # Core business services
│   │   │       ├── session-booking.service.ts
│   │   │       └── graphql-queries.ts
│   │   ├── features/
│   │   │   └── session-booking/        # Feature modules
│   │   │       ├── date-selection/
│   │   │       ├── confirmation/
│   │   │       └── completion/
│   │   ├── shared/
│   │   │   └── components/             # Reusable components
│   │   │       ├── calendar/
│   │   │       ├── host-profile/
│   │   │       ├── session-details/
│   │   │       ├── session-header/
│   │   │       ├── time-selection/
│   │   │       └── user-profile/
│   │   ├── models/
│   │   │   └── session.interface.ts    # TypeScript interfaces
│   │   ├── app.component.*             # Root component
│   │   ├── app.config.ts               # App configuration
│   │   └── app.routes.ts               # Routing configuration
│   ├── environments/                   # Environment configs
│   ├── assets/                         # Static assets
│   └── styles.scss                     # Global styles
├── karma.conf.js                       # Test configuration
├── angular.json                        # Angular workspace config
└── package.json                        # Dependencies and scripts
```

## 🔄 Development Workflow

### Component Architecture

The application follows Angular best practices:

- **Standalone Components**: All components are standalone for better tree-shaking
- **OnPush Change Detection**: Optimized performance with OnPush strategy
- **Smart/Dumb Components**: Clear separation of concerns
- **Reactive Forms**: Type-safe form handling

### State Management

- **Service-based State**: Centralized state management through services
- **RxJS Observables**: Reactive data flow
- **Apollo Cache**: GraphQL response caching

## 🌐 API Integration

### GraphQL Endpoints

The application integrates with GraphQL APIs:

**Queries:**

- `getSessionPage(id: ID!)` - Fetch session details
- `getAvailableDateTimes(userId: ID!)` - Get availability data

**Headers:**

```typescript
{
  'Authorization': 'Bearer YOUR_API_KEY',
  'Content-Type': 'application/json'
}
```

### Data Models

Key interfaces:

```typescript
interface SessionPage {
  date: string;
  time: string;
  duration: number;
  host: SessionHost;
  user: SessionUser;
  service: SessionService;
}

interface DateAvailability {
  date: string;
  times: TimeRange[];
}
```
