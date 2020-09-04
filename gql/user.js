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
            email
            surname
            other_names
            user_id
            altPhoneNumber
            current_balance
            avatar
            monthly_contribution
            current_monthly_income
            dept
            details
            dob
            email
            faculty
            gender
            phone_number
            rank
            role
            insertedAt
            updatedAt
            status
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
          vendor{
            id
            name
            accountStatus
            defaultCurrency
            description
            address
            
          }
        
      }
  }
`;

