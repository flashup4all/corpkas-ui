import { gql } from '@apollo/client';

export const GET_MEMBERS = gql`
query {
    members {
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
}
`;