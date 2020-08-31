import { gql } from '@apollo/client';

export const USERS = gql`
query {
    users  {
        id
        email
        role
    }
  }
`;

export const LOGIN = gql`
  mutation authenticate($email: String!, $password: String!) {
    authenticate(auth: {
        email: $email,
        password: $password,
      }){
        
          token
            user{
            id
            email
            role
          }
          member{
            id
            surname
            role
            currentBalance
            monthlyContribution
            currentMonthlyIncome
            email
            userId
          }
          staff{
            id
            surname
            role
            email
            userId
            avatar
            details
            insertedAt
            otherNames
            phoneNumber
            role
            dob
            status
          }
        
      }
  }
`;

