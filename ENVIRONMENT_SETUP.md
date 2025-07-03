# Environment Setup

This project requires GraphQL API configuration that should not be committed to version control.

## Setup Instructions

1. **Copy template files:**

   ```bash
   cp src/environments/environment.template.ts src/environments/environment.ts
   cp src/environments/environment.prod.template.ts src/environments/environment.prod.ts
   ```

2. **Update with your credentials:**

   Edit `src/environments/environment.ts` and replace:

   - `YOUR_GRAPHQL_API_URL_HERE` with your actual GraphQL API URL
   - `YOUR_API_KEY_HERE` with your actual API key

   Edit `src/environments/environment.prod.ts` with production credentials.

## Current Configuration

The application expects these environment variables:

```typescript
export const environment = {
  production: false, // or true for prod
  graphql: {
    apiUrl: "YOUR_GRAPHQL_API_URL",
    apiKey: "YOUR_API_KEY",
  },
};
```

## GraphQL API Details

- **Query**: `getSessionPage(id: ID!)`
- **Query**: `getAvailableDateTimes(userId: ID!)`
- **Headers**: Requires API key authentication
