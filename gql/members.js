import { gql } from '@apollo/client';


export const GET_PAGINATE_MEMBERS = gql`
query ($page: Int){
  paginateMembers(page: $page) {
    entries {
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
      pageSize
    pageNumber
    totalPages
    totalEntries
  }
}
`;
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

export const GET_MEMBER_TOTALS = gql`
query {
  memberTotals {
      total
    active
    inactive
    closed
  }
}
`;
export const CREATE_MEMBER = gql`
  mutation createMember(
      $staff_no: String!, $surname: String!, 
      $other_names: String!, $role: String!,
      $dob: String!,$gender: String!, 
      $status: String!,$email: String!, 
      $alt_phone_number: String,
      $dept: String,
      $monthly_contribution: String!,
      $current_monthly_income: String!,
      $membership_date: String!,
      $rank: String,
      $phone_number: String!) {
    createMember(member: {
        email: $email,
        status: $status,
        role: $role,
        surname: $surname,
        other_names: $other_names,
        phone_number: $phone_number,
        alt_phone_number: $alt_phone_number,
        staff_no: $staff_no,
        dob: $dob,
        gender: $gender,
        rank: $rank,
        dept: $dept,
        monthly_contribution: $monthly_contribution,
        current_monthly_income: $current_monthly_income,
        membership_date: $membership_date
      }){
        
        id
        surname
        other_names
        email
        phone_number
        alt_phone_number
        gender
        avatar
        dob
        avatar
        role
        status
        userId
        inserted_at
        updated_at
           
        
      }
  }
`;