import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideApollo } from 'apollo-angular';
import { InMemoryCache, createHttpLink } from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';

import { routes } from './app.routes';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideApollo(() => {
      const httpLink = createHttpLink({
        uri: environment.graphql.apiUrl,
      });

      const authLink = setContext((_, { headers }) => {
        return {
          headers: {
            ...headers,
            'x-api-key': environment.graphql.apiKey,
            'Content-Type': 'application/json',
          },
        };
      });

      return {
        link: authLink.concat(httpLink),
        cache: new InMemoryCache(),
        defaultOptions: {
          watchQuery: {
            errorPolicy: 'all',
          },
        },
      };
    }),
  ],
};
