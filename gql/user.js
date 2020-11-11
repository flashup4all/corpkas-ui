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
            user_id
            avatar
            details
            inserted_at
            other_names
            phone_number
            role
            dob
            status
          }
          vendor{
            id
            name
            account_status
            default_currency
            description
            address
            phone_numbers
            
          }
        
      }
  }
`;

export const UPDATE_PASSWORD = gql`
  mutation updateUserPassword($id: Int!, $password: String!, $old_password: String!) {
    updateUserPassword(user: {
      id: $id,
      password: $password,
      old_password: $old_password
      }){
        
          id
          email
        
      }
  }
`;

export const SEND_OTP = gql`
  mutation sendOtp($email: String!) {
    sendOtp(email: $email){
      email
      status
      message
    }
  }
`;

export const VALIDATE_OTP = gql`
  mutation validateOtp($email: String!, $otp: String!) {
    validateOtp(email: $email, otp: $otp){
      email
    id
    role
    }
  }
`;


export const GENERATE_LOGIN_DETAILS = gql`
query ($user_id: Int!) {
    generateLoginDetails(user_id: $user_id) {
      id
      email
      role
      new_password
      staff_no
      surname
      other_names
    }
  }
`;
