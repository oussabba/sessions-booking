import { gql } from 'apollo-angular';

export const GET_SESSION_PAGE = gql`
  query GetSessionPage($id: ID!) {
    getSessionPage(id: $id) {
      date
      time
      duration
      host {
        firstName
        lastName
        photo
        profession
      }
      user {
        firstName
        lastName
        email
        timeZone
      }
      service {
        title
      }
    }
  }
`;

export const GET_AVAILABLE_DATE_TIMES = gql`
  query GetAvailableDateTimes($userId: ID!) {
    getAvailableDateTimes(userId: $userId) {
      date
      times {
        start
        end
      }
    }
  }
`;
