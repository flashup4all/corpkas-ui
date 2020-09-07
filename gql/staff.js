import { gql } from '@apollo/client';

export const GET_PAGINATE_STAFF = gql`
query ($page: Int){
  paginateStaff(page: $page) {
    entries {
      id
      email
      surname
      other_names
      user_id
      altPhoneNumber
      avatar
      details
      dob
      email
      gender
      phone_number
      role
      inserted_at
      updated_at
      status
        }
      pageSize
    pageNumber
    totalPages
    totalEntries
  }
}
`;
export const GET_STAFFS = gql`
query {
    staff {
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

export const CREATE_STAFF = gql`
  mutation createStaff(
      $staff_no: String!, $surname: String!, 
      $other_names: String!, $role: String!,
      $dob: String!,$gender: String!, 
      $status: String!,$email: String!, 
      $alt_phone_number: String,
      $phone_number: String!, $password: String!) {
    createStaff(staff: {
        email: $email,
        status: $status,
        role: $role,
        surname: $surname,
        other_names: $other_names,
        phone_number: $phone_number,
        alt_phone_number: $alt_phone_number,
        staff_no: $staff_no,
        dob: $dob,
        gender: $gender 
        password: $password,
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

export const FILTER_STAFF = gql`
  mutation filterStaff(
      $status: String,
      $from: String,
      $to: String, 
      $gender: String, 
      $role: String) {
        filterStaff(filter: {
        from: $from,
        status: $status,
        role: $role,
        to: $to,
        gender: $gender 
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

